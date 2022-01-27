import os
from pprint import pprint
from datetime import datetime

from pydash import uniq_by

os.environ["WB_DOMAIN"] = "localhost"
os.environ["WB_PORT"] = "27017"

from api.db import database as db
from api.db.user import user
from api.db.expenses import Expenses
from api.db.incomes import Incomes
from api.db.hours import Hours
from api.db.assets import Assets
from api.db.debts import Debts
from api.db.goals import Goals
from api.db.networths import Networths


def print_crypto_prices():
    assets = [asset for asset in Assets.get_all() if asset["type"] == "crypto"]
    for asset in assets:
        print(f"{asset['name']}: $ {asset['price']}")


if __name__ == "__main__":
    pass
