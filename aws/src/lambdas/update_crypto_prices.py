"""Lambda handler for updating crypto prices"""

from datetime import datetime, timezone
from pydash import filter_
from cryptocompare import cryptocompare

from services.dynamo import Account, Security
from services.ssm import get_parameter
from .__util__ import log_action


def get_crypto_prices(tickers: set):
    """get current crypto prices"""
    crypto_compare_key = get_parameter("CRYPTO_COMPARE_PARAM_NAME")
    cryptocompare._set_api_key_parameter(crypto_compare_key)
    return cryptocompare.get_price(list(tickers), currency="USD")


def handler(event, context):
    """
    Lambda handler for updating crypto prices
    Original schedule: 30 18,6 * * * (6:30 AM and 6:30 PM daily)
    """
    try:
        now = datetime.now(timezone.utc)
        accounts = {}
        tickers = set()

        crypto_securities = list(
            filter_(
                Security.scan(Security.active == True),
                lambda security: security.security_type == "Crypto"
                and security.shares > 0,
            )
        )

        for security in crypto_securities:
            tickers.add(security.ticker.upper())

        if not tickers:
            print("No crypto securities found to update")
            return {"statusCode": 200, "body": "No crypto securities to update"}

        prices = get_crypto_prices(tickers)

        for security in crypto_securities:
            ticker_upper = security.ticker.upper()
            if ticker_upper in prices and "USD" in prices[ticker_upper]:
                price = prices[ticker_upper]["USD"]
                security.price = round(price, 2)

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

        message = "Crypto securities updated"
        print(message)
        log_action("Update Crypto Prices", message)
        return {"statusCode": 200, "body": message}

    except Exception as e:
        print(f"Error updating crypto prices: {str(e)}")
        log_action("Update Crypto Prices", f"Error: {str(e)}", status="error")
        return {"statusCode": 500, "body": f"Error: {str(e)}"}
