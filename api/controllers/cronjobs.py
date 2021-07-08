from flask import request, Blueprint
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

from api.controllers.__util__ import success_result, failure_result
from api.db.assets import Assets
from api.db import CRYPTO_KEY

cryptocompare._set_api_key_parameter(CRYPTO_KEY)

cronjobs = Blueprint("cronjobs", __name__)


def get_crypto_prices(tickers: list):
    return cryptocompare.get_price(tickers, currency="USD")


def get_stock_price(ticker: str):
    return stock_info.get_live_price(ticker.upper())


@cronjobs.route("/cronjobs/update_crypto_price", methods=["GET"])
def _update_crypto_price():
    """
    0 12,18 * * * curl localhost:9000/cronjobs/update_crypto_price
    """
    try:
        if request.method == "GET":
            crypto_assets = list(
                filter(lambda asset: asset["type"] == "crypto", Assets.get_all())
            )

            tickers = list(map(lambda asset: asset["ticker"].upper(), crypto_assets))
            prices = get_crypto_prices(tickers)

            for asset in crypto_assets:
                asset["price"] = prices[f"{asset['ticker'].upper()}"]["USD"]
                asset["value"] = asset["price"] * asset["shares"]
                Assets.update(asset)

            return success_result("Success")
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
