# pylint: disable=import-error, broad-except, protected-access, cell-var-from-loop
"""Cronjob controller"""

import os
import math
from datetime import datetime, date, timedelta

from pydash import filter_, map_, find
from flask import request, Blueprint, current_app
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

from services.dynamo import Account, Asset, Bill, Debt, Networth
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
        crypto_assets = list(
            filter_(Asset.list(), lambda asset: asset.category == "crypto")
        )

        tickers = map_(crypto_assets, lambda asset: asset.name.upper())
        prices = get_crypto_prices(tickers)

        for asset in crypto_assets:
            price = prices[f"{asset.name.upper()}"]["USD"]
            asset.price = round(price, 2)
            asset.value = round(asset.price * asset.shares, 2)

            current_app.logger.info("%s: %s", asset.name, asset.price)
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
            filter_(Asset.list(), lambda asset: asset.category == "stock")
        )

        tickers = map_(stock_assets, lambda asset: asset.name.upper())
        for ticker in tickers:
            asset = find(stock_assets, lambda asset: asset.name == ticker)
            asset.price = round(float(get_stock_price(ticker.upper())), 2)
            asset.value = round(asset.price * asset.shares, 2)

            current_app.logger.info("%s: %s", asset.name, asset.price)
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
    if request.method != "POST":
        return failure_result("Invalid method")

    _date = datetime.now().replace(hour=12, minute=0, second=0, microsecond=0)
    current_app.logger.info(f"Networth snapshot :: {_date}")

    assets, debts = [], []
    accounts = Account.list(user_id=USER_ID)
    allAssets = Asset.list(user_id=USER_ID)
    allDebts = Debt.list(user_id=USER_ID)

    for account in accounts:
        assets.extend(
            [
                {
                    "asset_id": asset.asset_id,
                    "account_id": account.account_id,
                    "name": asset.name,
                    "value": asset.value,
                    "category": asset.category,
                }
                for asset in filter_(
                    allAssets,
                    lambda a: a.account_id == account.account_id and a.value > 0,
                )
            ]
        )

        debts.extend(
            [
                {
                    "debt_id": debt.debt_id,
                    "account_id": account.account_id,
                    "name": debt.name,
                    "value": debt.amount,
                    "category": debt.category,
                }
                for debt in filter_(
                    allDebts,
                    lambda d: d.account_id == account.account_id and d.amount > 0,
                )
            ]
        )

    networth = Networth.get_month(user_id=USER_ID, year=_date.year, month=_date.month)

    networth_data = {
        "user_id": USER_ID,
        "_date": _date,
        "year": _date.year,
        "month": _date.month,
        "assets": assets,
        "debts": debts,
    }

    if not networth:
        Networth.create(**networth_data)
        current_app.logger.info("Networth created")
    else:
        for key, value in networth_data.items():
            setattr(networth, key, value)
        networth.save()
        current_app.logger.info("Networth updated")

    return success_result("Networth snapshot created/updated successfully")


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
