# pylint: disable=import-error, broad-except, protected-access
"""Cronjob controller"""

import os
from datetime import datetime
from pydash import filter_, map_
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
    0 12,18 * * * curl localhost:9000/cronjobs/update_crypto_prices
    """

    if request.method == "GET":
        crypto_assets = list(
            filter_(mongo.asset.get(), lambda asset: asset.type == "crypto")
        )

        tickers = map_(crypto_assets, lambda asset: asset.name.upper())
        prices = get_crypto_prices(tickers)

        for asset in crypto_assets:
            asset.price = prices[f"{asset.name.upper()}"]["USD"]
            asset.value = asset.price * asset.shares
            asset.update()

        return success_result("assets updated")

    return failure_result()


@handle_exception
@cronjobs.route("/cronjobs/update_stock_prices", methods=["GET"])
def update_stock_prices():
    """
    0 12,18 * * * curl localhost:9000/cronjobs/update_stock_prices
    """

    if request.method == "GET":
        # stock_assets = list(
        #     filter_(mongo.asset.get(), lambda asset: asset.type == "stock")
        # )

        # tickers = map_(stock_assets, lambda asset: asset.name.upper())
        # prices = get_stock_prices(tickers)

        # for asset in stock_assets:
        #     asset.price = prices[f"{asset.name.upper()}"]["USD"]
        #     asset.value = asset.price * asset.shares
        #     asset.update()

        return success_result("assets updated")

    return failure_result()


@handle_exception
@cronjobs.route("/cronjobs/networth_snapshot", methods=["POST"])
def networth_snapshot():
    """
    59 23 L * * curl localhost:9000/cronjobs/networth_snapshot
    """

    if request.method == "POST":
        assets = mongo.asset.get()
        debts = mongo.debt.get()
        _date = datetime.now()

        print(f"assets: {assets}")
        print(f"debts: {debts}")
        print(f"date: {_date}")

        # Networths.create(
        #     {
        #         "date": date,
        #         "month": date.month,
        #         "year": date.year,
        #         "assets": assets,
        #         "debts": debts,
        #     }
        # )
        return success_result("Success")
