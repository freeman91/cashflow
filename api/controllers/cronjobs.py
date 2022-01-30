# pylint: disable=import-error, broad-except, protected-access
"""Cronjob controller"""

from flask import request, Blueprint
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

from api.controllers.__util__ import success_result, failure_result
from api.db.assets import Assets
from api.db.expenses import Expenses

# from api.db.networths import Networths
from api.db import CRYPTO_KEY


cronjobs = Blueprint("cronjobs", __name__)


def get_crypto_prices(tickers: list):
    """get current crypto prices"""

    cryptocompare._set_api_key_parameter(CRYPTO_KEY)
    return cryptocompare.get_price(tickers, currency="USD")


def get_stock_price(ticker: str):
    """get current stock prices"""

    return stock_info.get_live_price(ticker.upper())


@cronjobs.route("/cronjobs/update_crypto_prices", methods=["GET"])
def update_crypto_prices():
    """
    0 12,18 * * * curl localhost:9000/cronjobs/update_crypto_prices
    """

    try:
        if request.method == "GET":
            crypto_assets = list(
                filter(lambda asset: asset["type"] == "crypto", Assets.get_all())
            )

            tickers = list(map(lambda asset: asset["name"].upper(), crypto_assets))
            prices = get_crypto_prices(tickers)

            for asset in crypto_assets:
                asset["price"] = prices[f"{asset['name'].upper()}"]["USD"]
                asset["value"] = asset["price"] * asset["shares"]
                Assets.update(asset)

            return success_result("Success")

        return failure_result("Bad Request")

    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@cronjobs.route("/cronjobs/networth_snapshot", methods=["GET"])
def networth_snapshot():
    """
    59 23 L * * curl localhost:9000/cronjobs/networth_snapshot
    """

    try:
        # assets = []
        # debts = []
        # date = datetime.now()

        if request.method == "GET":
            for asset in Assets.get_all():
                print(asset)

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
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
