# pylint: disable=import-error, unused-import, wrong-import-position, missing-function-docstring
"""workbench"""

import os
from pprint import pprint
from datetime import datetime, timedelta

from pydash import uniq_by, reduce_

os.environ["WB_DOMAIN"] = "localhost"
os.environ["WB_PORT"] = "27017"

from api import mongo
from api.mongo.models.Income import Income

from api.mongo.connection import database

# def print_crypto_prices():
#     assets = [asset for asset in Assets.get_all() if asset["type"] == "crypto"]
#     for asset in assets:
#         print(f"{asset['name']}: $ {asset['price']}")


# def generate_networth():
#     assets = [
#         {"amount": 780.0, "name": "", "type": "Cash"},
#         {"amount": 2895.27, "name": "Huntington", "type": "Checking"},
#         {"amount": 0.48, "name": "Ally", "type": "Savings"},
#         {"amount": 2000.0, "name": "Malibu", "type": "Vehicle"},
#         {"amount": 6464.38, "name": "crypto", "type": "Investment"},
#         {"amount": 180.94, "name": "stocks", "type": "Investment"},
#         {"amount": 10890.58, "name": "401k", "type": "Investment"},
#         {"amount": 228900.0, "name": "3437 Beulah Rd", "type": "Property"},
#     ]
#     debts = [
#         {"amount": 28500.0, "name": "Great Lakes", "type": "Tuition"},
#         {"amount": 207319.30, "name": "3437 Beulah Rd", "type": "Mortgage"},
#     ]

#     networth = {
#         "assets": assets,
#         "debts": debts,
#         "year": 2022,
#         "month": 3,
#         "date": datetime(2022, 3, 31, 12),
#     }
#     Networths.create(networth)


def test():
    pass


if __name__ == "__main__":
    pass
