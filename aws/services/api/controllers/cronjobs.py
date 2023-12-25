# pylint: disable=import-error, broad-except, protected-access, cell-var-from-loop
"""Cronjob controller"""

import os
from datetime import datetime, date, timedelta
from pydash import filter_, map_, find, remove
from flask import request, Blueprint
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)


USER_ID = os.getenv("REACT_APP_USER_ID")
CRYPTO_KEY = os.getenv("CRYPTO_COMPARE_KEY")


cronjobs = Blueprint("cronjobs", __name__)


def decode_cron_rule(cron_expression: str):
    cron_parts = cron_expression.split()
    day_of_month = cron_parts[0]
    month = cron_parts[1]
    return day_of_month, month


def is_cron_match(cron_expression: str, target_date: date):
    day_of_month, months = decode_cron_rule(cron_expression)

    if months != "*":
        months = [int(substring) for substring in months.split(",")]

    if day_of_month != "*" and target_date.day != int(day_of_month):
        return False

    if months != "*" and str((target_date.month)) not in months:
        return False

    return True


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
            filter_(dynamo.asset.get(), lambda asset: asset.type == "crypto")
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
            filter_(dynamo.asset.get(), lambda asset: asset.type == "stock")
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
        _date = datetime.now()

        assets = []
        debts = []

        accounts = dynamo.account.get(user_id=USER_ID)
        allAssets = dynamo.asset.get(user_id=USER_ID)
        debts = dynamo.asset.get(user_id=USER_ID)

        for account in accounts:
            account_assets = filter_(allAssets, lambda asset: asset.account_id == account.account_id)
            for asset in account_assets:
                if asset.value > 0:
                    assets.append({
                        "name": asset.name,
                        "value": asset.value,
                        "category": asset.category,
                        "vendor": account.name
                    })

            account_debts = filter_(allAssets, lambda debt: debt.account_id == account.account_id)
            for debt in account_debts:
                if debt.value > 0:
                    debts.append({
                        "name": debt.name,
                        "value": debt.value,
                        "category": debt.category,
                        "lender": account.name
                    })
            

        # networth = dynamo.networth.get(year=_date.year, month=_date.month)
        # if not networth:
        #     dynamo.networth.create(
        #         {
        #             "date": _date,
        #             "month": _date.month,
        #             "year": _date.year,
        #             "assets": assets,
        #             "debts": debts,
        #         }
        #     )

        #     print("Networth created")

        # else:
        #     networth.date = _date
        #     networth.assets = assets
        #     networth.debts = debts
        #     # networth.save()

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

        for bill in dynamo.bill.get():
            if is_cron_match(bill.rule, _date):
                bill_expense = find(
                    dynamo.expense.get(),
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
            dynamo.expense.create(expense)

        return success_result(f"{len(new_expenses)} expenses generates for {_date}")

    return failure_result()
