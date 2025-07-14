"""Lambda handler for updating stock prices"""

from datetime import datetime, timezone
from typing import List
from pydash import filter_, map_
import requests

from services.dynamo import Account, Security
from services.ssm import get_parameter
from services.api.controllers.__util__ import log_action

ALPHA_ADVANTAGE_URL = "https://www.alphavantage.co/query"


def get_stock_prices(tickers: List):
    """get current stock prices"""

    alpha_vantage_key = get_parameter("ALPHAVANTAGE_PARAM_NAME")
    prices = {}

    for symbol in tickers:
        url = f"{ALPHA_ADVANTAGE_URL}?function=GLOBAL_QUOTE&symbol={symbol}&apikey={alpha_vantage_key}"
        response = requests.get(url).json()
        try:
            prices[symbol] = float(response["Global Quote"]["05. price"])
        except (KeyError, TypeError):
            prices[symbol] = None  # Handle missing or malformed data
    return prices


def handler(event, context):
    """
    Lambda handler for updating stock prices
    Original schedule: 30 18 * * * (6:30 PM daily)
    """
    try:
        stock_types = ["Stock", "Mutual Fund", "Index Fund", "ETF"]
        now = datetime.now(timezone.utc)
        accounts = {}

        stock_securities = list(
            filter_(
                Security.scan(Security.active == True),
                lambda securities: securities.security_type in stock_types
                and securities.shares > 0,
            )
        )

        if not stock_securities:
            print("No stock securities found to update")
            return {"statusCode": 200, "body": "No stock securities to update"}

        tickers = map_(stock_securities, lambda securities: securities.ticker.upper())

        print(f"tickers: {tickers}")
        ticker_prices = get_stock_prices(tickers)

        print(f"ticker_prices: {ticker_prices}")

        for security in stock_securities:
            ticker_upper = security.ticker.upper()
            if ticker_upper in ticker_prices:
                ticker = ticker_prices[ticker_upper]

                if ticker:
                    security.price = round(float(ticker), 2)

                print(f"{security.ticker}: {security.price}")

                if security.account_id not in accounts:
                    accounts[security.account_id] = {
                        "user_id": security.user_id,
                        "value": round(security.shares * security.price, 2),
                    }
                else:
                    accounts[security.account_id]["value"] += round(
                        security.shares * security.price, 2
                    )

                security.last_update = now
                security.save()

        for account_id, values in accounts.items():
            user_id = values["user_id"]
            value = values["value"]
            account = Account.get_(user_id, account_id)
            account.value = value
            account.last_update = now
            account.save()

        message = "Stock securities updated"
        log_action("SYSTEM", message)
        return {"statusCode": 200, "body": message}

    except Exception as e:
        print(f"Error updating stock prices: {str(e)}")
        return {"statusCode": 500, "body": f"Error: {str(e)}"}
