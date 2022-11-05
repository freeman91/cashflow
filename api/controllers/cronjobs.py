# pylint: disable=import-error, broad-except, protected-access, cell-var-from-loop
"""Cronjob controller"""

import os
from datetime import datetime
from pydash import filter_, map_, find, remove
from flask import request, Blueprint
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

from api import mongo
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
@cronjobs.route("/cronjobs/update_crypto_prices", methods=["GET"])
def update_crypto_prices():
    """
    0 18 * * * curl localhost:9000/cronjobs/update_crypto_prices
    """

    if request.method == "GET":
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
@cronjobs.route("/cronjobs/update_stock_prices", methods=["GET"])
def update_stock_prices():
    """
    0 18 * * * curl localhost:9000/cronjobs/update_stock_prices
    """

    if request.method == "GET":
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
            print("Networth updated")

        return success_result("Success")
