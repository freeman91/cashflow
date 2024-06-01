# pylint: disable=import-error, broad-except, protected-access, cell-var-from-loop
"""Cronjob controller"""

import os
from datetime import datetime, date, timedelta

from pydash import filter_, map_, find
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
            filter_(dynamo.asset.get(), lambda asset: asset.category == "crypto")
        )

        tickers = map_(crypto_assets, lambda asset: asset.name.upper())
        prices = get_crypto_prices(tickers)

        for asset in crypto_assets:
            asset.price = prices[f"{asset.name.upper()}"]["USD"]
            asset.value = asset.price * asset.shares

            print(f"{asset.name}: {asset.price}")
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
            filter_(dynamo.asset.get(), lambda asset: asset.category == "stock")
        )

        tickers = map_(stock_assets, lambda asset: asset.name.upper())
        for ticker in tickers:
            asset = find(stock_assets, lambda asset: asset.name == ticker)
            asset.price = float(get_stock_price(ticker.upper()))
            asset.value = asset.price * asset.shares

            print(f"{asset.name}: {asset.price}")
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
        allDebts = dynamo.debt.get(user_id=USER_ID)

        for account in accounts:
            account_assets = filter_(
                allAssets, lambda asset: asset.account_id == account.account_id
            )
            for asset in account_assets:
                if asset.value > 0:
                    assets.append(
                        {
                            "name": asset.name,
                            "value": asset.value,
                            "category": asset.category,
                            "vendor": account.name,
                        }
                    )

            account_debts = filter_(
                allDebts, lambda debt: debt.account_id == account.account_id
            )
            for debt in account_debts:
                if debt.amount > 0:
                    debts.append(
                        {
                            "name": debt.name,
                            "value": debt.amount,
                            "category": debt.category,
                            "lender": account.name,
                        }
                    )

        networth = dynamo.networth.get(
            year=_date.year, month=_date.month, user_id=USER_ID
        )
        if not networth:
            dynamo.networth.create(
                user_id=USER_ID,
                _date=_date,
                year=_date.year,
                month=_date.month,
                assets=assets,
                debts=debts
            )
            print("Networth created")

        else:
            networth.date = _date
            networth.assets = assets
            networth.debts = debts
            networth.save()
            print("Networth updated")

        return success_result("Success")


@handle_exception
@cronjobs.route("/cronjobs/generate_bill_expenses", methods=["POST"])
def generate_bill_expenses():
    """
    0 0 * * * curl -X POST localhost:9000/cronjobs/generate_bill_expenses
    """

    if request.method == "POST":
        _date = date.today() + timedelta(days=31)

        for bill in dynamo.bill.get():
            if _date.day == bill.day and _date.month in bill.months:
                expense = bill.generate(year=_date.year, month=_date.month)
                print(f"{bill.name} - {expense}")

        return success_result()

    return failure_result()
