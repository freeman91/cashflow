# pylint: disable=import-error, broad-except, protected-access, cell-var-from-loop
"""Cronjob controller"""

import os
from datetime import datetime, date, timedelta
from pydash import filter_, map_, find, remove
from flask import request, Blueprint
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

from api import mongo
from api.helpers.cron import is_cron_match
from api.controllers.__util__ import failure_result, handle_exception, success_result


CRYPTO_KEY = os.getenv("CRYPTO_COMPARE_KEY")


cronjobs = Blueprint("cronjobs", __name__)


def get_crypto_prices(tickers: list):
    """get current crypto prices"""

    cryptocompare._set_api_key_parameter(CRYPTO_KEY)
    return cryptocompare.get_price(tickers, currency="USD")


def get_stock_price(ticker: str):
    """get current stock prices"""

    return stock_info.get_live_price(ticker.upper())


@handle_exception
@cronjobs.route("/cronjobs/update_crypto_prices", methods=["PUT"])
def update_crypto_prices():
    """
    0 18 * * * curl -X PUT localhost:9000/cronjobs/update_crypto_prices
    """

    if request.method == "PUT":
        crypto_assets = list(
            filter_(mongo.asset.get(), lambda asset: asset.type == "crypto")
        )

        tickers = map_(crypto_assets, lambda asset: asset.name.upper())
        prices = get_crypto_prices(tickers)

        print(f"{prices = }")

        for asset in crypto_assets:
            asset.price = prices[f"{asset.name.upper()}"]["USD"]
            asset.value = asset.price * asset.shares
            asset.save()

        return success_result("assets updated")

    return failure_result()


@handle_exception
@cronjobs.route("/cronjobs/update_stock_prices", methods=["PUT"])
def update_stock_prices():
    """
    0 18 * * * curl -X PUT localhost:9000/cronjobs/update_stock_prices
    """

    if request.method == "PUT":
        stock_assets = list(
            filter_(mongo.asset.get(), lambda asset: asset.type == "stock")
        )

        tickers = map_(stock_assets, lambda asset: asset.name.upper())
        for ticker in tickers:
            asset = find(stock_assets, lambda asset: asset.name == ticker)
            asset.price = float(get_stock_price(ticker.upper()))

            asset.value = asset.price * asset.shares
            asset.save()

        return success_result("assets updated")

    return failure_result()


@handle_exception
@cronjobs.route("/cronjobs/networth_snapshot", methods=["POST"])
def networth_snapshot():
    """
    0 22 30 4,6,9,11        * curl -X POST localhost:9000/cronjobs/networth_snapshot
    0 22 31 1,3,5,7,8,10,12 * curl -X POST localhost:9000/cronjobs/networth_snapshot
    0 22 28 2               * curl -X POST localhost:9000/cronjobs/networth_snapshot

    0 22 28 * * curl -X POST localhost:9000/cronjobs/networth_snapshot > /dev/null
    """

    if request.method == "POST":
        assets = mongo.asset.get()
        debts = mongo.debt.get()
        _date = datetime.now()

        assets = map_(
            mongo.asset.get(),
            lambda asset: {
                "amount": asset.value,
                "name": asset.name,
                "type": asset.type,
            },
        )

        remove(
            assets,
            lambda asset: asset.get("amount") == 0,
        )

        debts = map_(
            mongo.debt.get(),
            lambda debt: {"amount": debt.value, "name": debt.name, "type": debt.type},
        )

        remove(
            debts,
            lambda debt: debt.get("amount") == 0,
        )

        networth = mongo.networth.get(year=_date.year, month=_date.month)
        if not networth:
            mongo.networth.create(
                {
                    "date": _date,
                    "month": _date.month,
                    "year": _date.year,
                    "assets": assets,
                    "debts": debts,
                }
            )

            print("Networth created")

        else:
            networth.date = _date
            networth.assets = assets
            networth.debts = debts
            networth.save()

        return success_result("Success")


@handle_exception
@cronjobs.route("/cronjobs/generate_bill_expenses", methods=["POST"])
def generate_bill_expenses():
    """
    0 0 * * * curl -X POST localhost:9000/cronjobs/generate_bill_expenses
    """

    if request.method == "POST":
        new_expenses = []
        _date = date.today() + timedelta(days=31)

        for bill in mongo.bill.get():
            if is_cron_match(bill.rule, _date):
                bill_expense = find(
                    mongo.expense.get(),
                    lambda expense: expense.type == bill.type
                    and expense.vendor == bill.vendor
                    and expense.date.date() == _date,
                )

                if not bill_expense:
                    new_expense = {
                        "amount": bill.amount,
                        "date": datetime(_date.year, _date.month, _date.day, 12, 0),
                        "type": bill.type,
                        "vendor": bill.vendor,
                        "description": bill.description,
                        "paid": False,
                        "bill_id": bill.id,
                    }
                    new_expenses.append(new_expense)

        for expense in new_expenses:
            print(expense)
            mongo.expense.create(expense)

        return success_result(f"{len(new_expenses)} expenses generates for {_date}")

    return failure_result()
