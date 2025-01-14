# pylint: disable=import-error, broad-except, protected-access, cell-var-from-loop, singleton-comparison
"""Cronjob controller"""

import os
import math
from datetime import date, datetime, timezone, timedelta
from zoneinfo import ZoneInfo
from pydash import filter_, map_, find, find_index, sort_by
from flask import request, Blueprint, current_app
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

from services.dynamo import Account, History, Recurring, Security
from services.dynamo.history import ValueItem
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

CRYPTO_KEY = os.getenv("CRYPTO_COMPARE_KEY")


cronjobs = Blueprint("cronjobs", __name__)


def get_crypto_prices(tickers: set):
    """get current crypto prices"""

    cryptocompare._set_api_key_parameter(CRYPTO_KEY)
    return cryptocompare.get_price(list(tickers), currency="USD")


def get_stock_price(ticker: str):
    """get current stock prices"""

    result = stock_info.get_data(ticker.upper())
    value = result.close.iloc[-1]
    if math.isnan(value):
        value = result.close.iloc[-2]

    return value


def update_or_create_history(
    month_str: str, item_id: str, user_id: str, account_type: str, value_item: dict
):
    history = History.get_(item_id, month_str)
    if history:
        idx = find_index(history.values, lambda v: v["date"] == value_item["date"])
        if idx > -1:
            history.values[idx] = value_item
        else:
            history.values.append(value_item)

        history.values = sort_by(history.values, "date")
        history.last_update = datetime.now(timezone.utc)
        history.save()

    else:
        History.create(item_id, month_str, account_type, user_id, [value_item])


@handle_exception
@cronjobs.route("/cronjobs/update_crypto_prices", methods=["PUT"])
def update_crypto_prices():
    """
    30 18,6 * * * curl -X PUT localhost:9000/cronjobs/update_crypto_prices
    """

    if request.method == "PUT":
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

        prices = get_crypto_prices(tickers)

        for security in crypto_securities:
            price = prices[f"{security.ticker.upper()}"]["USD"]
            security.price = round(price, 2)

            current_app.logger.info("%s: %s", security.ticker, security.price)

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

        message = "crypto securities updated"
        current_app.logger.info(message)
        return success_result(message)

    return failure_result()


@handle_exception
@cronjobs.route("/cronjobs/update_stock_prices", methods=["PUT"])
def update_stock_prices():
    """
    30 18 * * * curl -X PUT localhost:9000/cronjobs/update_stock_prices
    """

    stock_types = ["Stock", "Mutual Fund", "Index Fund", "ETF"]

    if request.method == "PUT":
        now = datetime.now(timezone.utc)
        accounts = {}
        stock_securities = list(
            filter_(
                Security.scan(Security.active == True),
                lambda securities: securities.security_type in stock_types
                and securities.shares > 0,
            )
        )

        tickers = map_(stock_securities, lambda securities: securities.ticker.upper())
        ticker_prices = map_(
            tickers, lambda ticker: {"ticker": ticker, "price": get_stock_price(ticker)}
        )
        for security in stock_securities:
            ticker = find(
                ticker_prices, lambda t: t["ticker"] == security.ticker.upper()
            )
            ticker_price = ticker["price"]
            security.price = round(float(ticker_price), 2)

            current_app.logger.info("%s: %s", security.ticker, security.price)

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

        message = "stock securities updated"
        current_app.logger.info(message)
        return success_result(message)

    return failure_result()


@handle_exception
@cronjobs.route("/cronjobs/save_value_histories", methods=["POST"])
def save_value_histories():
    """
    45 18 * * * curl -X POST localhost:9000/cronjobs/save_value_histories > /dev/null
    """
    if request.method != "POST":
        return failure_result("Invalid method")

    utc_now = datetime.now(timezone.utc)
    ny_time = utc_now.astimezone(ZoneInfo("America/New_York"))

    current_app.logger.info(f"UTC: {utc_now}")
    current_app.logger.info(f"NY: {ny_time}")

    now = datetime.now(timezone.utc)
    month_str = now.strftime("%Y-%m")
    date_str = now.strftime("%Y-%m-%d")

    current_app.logger.info(f"Update Value Histories :: {now}")
    current_app.logger.info(f"{month_str} :: {date_str}")

    accounts = Account.scan(Account.active == True)
    securities = Security.scan(Security.active == True)

    for account in accounts:
        value = None
        if account.value is not None:
            value = account.value
        elif account.amount is not None:
            value = account.amount
        elif account.balance is not None:
            value = account.balance

        value_item = ValueItem(date=date_str, value=value)
        update_or_create_history(
            month_str,
            account.account_id,
            account.user_id,
            account.account_type,
            value_item,
        )

    for security in securities:
        if security.shares > 0:
            value = round(security.shares * security.price)
            value_item = ValueItem(
                date=date_str,
                value=value,
                shares=security.shares,
                price=security.price,
            )

            update_or_create_history(
                month_str, security.security_id, security.user_id, "Asset", value_item
            )

    message = "Value Histories created/updated successfully"
    current_app.logger.info(message)
    return success_result(message)


@handle_exception
@cronjobs.route("/cronjobs/generate_bill_expenses", methods=["POST"])
def generate_bill_expenses():
    """
    0 0 * * * curl -X POST localhost:9000/cronjobs/generate_bill_expenses
    """

    if request.method == "POST":
        count = 0
        _date = date.today() + timedelta(days=3)

        current_app.logger.info("Generating Expenses for :: %s", _date)

        for recurring in Recurring.scan(Recurring.active == True):
            if recurring.next_date is None:
                continue

            if (
                recurring.next_date.day == _date.day
                and recurring.next_date.month == _date.month
                and recurring.next_date.year == _date.year
            ):
                expense = recurring.generate(year=_date.year, month=_date.month)
                current_app.logger.info(
                    "Generating :: %s :: %s", recurring.name, expense
                )

                # TODO: update recurring.next_date

                count += 1

        message = f"{_date} :: {count} expenses generated"
        current_app.logger.info(message)
        return success_result(message)

    return failure_result()
