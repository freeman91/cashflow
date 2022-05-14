# pylint: disable=import-error, unused-import, wrong-import-position, missing-function-docstring
"""workbench"""

import os
from pprint import pprint
from datetime import datetime, timedelta

from yahoo_fin import stock_info
from pydash import uniq_by, reduce_, filter_, map_, find, remove

os.environ["WB_DOMAIN"] = "localhost"
os.environ["WB_PORT"] = "27017"

from api import mongo
from api.mongo.connection import database


def update_crypto_shares():
    assets = mongo.asset.get()
    crypto_assets = filter_(assets, lambda asset: asset.type == "crypto")
    for asset in crypto_assets:
        shares = input(f"{asset.name} shares: ")

        if shares == "s":
            continue

        asset.shares = float(shares)
        asset.save()


def test():
    pass


if __name__ == "__main__":
    pass
