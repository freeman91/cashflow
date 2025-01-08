# pylint: disable=import-error, broad-except, protected-access, cell-var-from-loop
"""Cronjob controller"""

import os
import math
from datetime import date, timedelta

from pydash import filter_, map_, find, find_index, sort_by
from flask import request, Blueprint, current_app
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

from services.dynamo import Account, Bill, History, Security
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


@handle_exception
@cronjobs.route("/cronjobs/update_crypto_prices", methods=["PUT"])
def update_crypto_prices():
    """
    0 18 * * * curl -X PUT localhost:9000/cronjobs/update_crypto_prices
    """

    if request.method == "PUT":
        tickers = set()
        crypto_securities = list(
            filter_(
                Security.list(),
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
            security.save()

        return success_result("crypto securities updated")

    return failure_result()


@handle_exception
@cronjobs.route("/cronjobs/update_stock_prices", methods=["PUT"])
def update_stock_prices():
    """
    0 18 * * * curl -X PUT localhost:9000/cronjobs/update_stock_prices
    """

    stock_types = ["Stock", "Mutual Fund", "Index Fund", "ETF"]

    if request.method == "PUT":
        stock_securities = list(
            filter_(
                Security.list(),
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
            security.save()

        return success_result("stock securities updated")

    return failure_result()


@handle_exception
@cronjobs.route("/cronjobs/save_value_histories", methods=["POST"])
def save_value_histories():
    """
    0 22 30 4,6,9,11        * curl -X POST localhost:9000/cronjobs/save_value_histories
    0 22 31 1,3,5,7,8,10,12 * curl -X POST localhost:9000/cronjobs/save_value_histories
    0 22 28 2               * curl -X POST localhost:9000/cronjobs/save_value_histories

    0 22 28 * * curl -X POST localhost:9000/cronjobs/save_value_histories > /dev/null
    """
    if request.method != "POST":
        return failure_result("Invalid method")

    _date = date.today()

    def update_or_create_history(
        item_id: str, user_id: str, account_type: str, value_item: dict
    ):
        history = History.get_(item_id, _date.strftime("%Y-%m"))
        if history:
            idx = find_index(history.values, lambda v: v["date"] == value_item["date"])
            if idx > -1:
                history.values[idx] = value_item
            else:
                history.values.append(value_item)

            history.values = sort_by(history.values, "date")
            for value in history.values:
                print(value.as_dict(), end=", ")

            print()
            history.save()

        else:
            History.create(
                item_id, _date.strftime("%Y-%m"), account_type, user_id, [value_item]
            )

    current_app.logger.info(f"Update Value Histories :: {_date}")

    accounts = Account.list()
    securities = Security.list()

    for account in accounts:
        value = None
        if account.value is not None:
            value = account.value
        elif account.amount is not None:
            value = account.amount
        elif account.balance is not None:
            value = account.balance

        value_item = ValueItem(
            date=_date.strftime("%Y-%m-%d"),
            value=value,
        )
        update_or_create_history(
            account.account_id, account.user_id, account.account_type, value_item
        )

    for security in securities:
        if security.shares > 0:
            value = round(security.shares * security.price)
            value_item = ValueItem(
                date=_date.strftime("%Y-%m-%d"),
                value=value,
                shares=security.shares,
                price=security.price,
            )

            update_or_create_history(
                security.security_id, security.user_id, "asset", value_item
            )

    return success_result("Value Histories created/updated successfully")


@handle_exception
@cronjobs.route("/cronjobs/generate_bill_expenses", methods=["POST"])
def generate_bill_expenses():
    """
    0 0 * * * curl -X POST localhost:9000/cronjobs/generate_bill_expenses
    """

    if request.method == "POST":
        count = 0
        _date = date.today() + timedelta(days=31)

        for bill in Bill.list():
            if _date.day == bill.day and _date.month in bill.months:
                expense = bill.generate(year=_date.year, month=_date.month)
                current_app.logger.info("%s - %s", bill.name, expense)
                count += 1

        return success_result(f"{_date} :: {count} expenses generated")

    return failure_result()
