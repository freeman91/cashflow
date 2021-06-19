import os
from pprint import pprint
from datetime import datetime
from cryptocompare import cryptocompare
from yahoo_fin import stock_info

os.environ["WB_DOMAIN"] = "localhost"
os.environ["WB_PORT"] = "27017"

from api.db import CRYPTO_KEY, database as db
from api.db.user import user
from api.db.expenses import Expenses
from api.db.incomes import Incomes
from api.db.hours import Hours
from api.db.assets import Assets
from api.db.debts import Debts
from api.db.goals import Goals
from api.db.networths import Networths

cryptocompare._set_api_key_parameter(CRYPTO_KEY)


def g_exp():
    exp1 = {
        "date": datetime(2021, 6, 21, 12),
        "amount": float(36.25),
        "type": "grocery",
        "vendor": "Kroger",
        "asset": "",
        "debt": "",
        "desc": "",
    }
    exp2 = {
        "date": datetime(2021, 6, 17, 12),
        "amount": float(74.23),
        "type": "home",
        "vendor": "Amazon",
        "asset": "",
        "debt": "",
        "desc": "",
    }
    exp3 = {
        "date": datetime(2021, 6, 15, 12),
        "amount": float(16.11),
        "type": "entertainment",
        "vendor": "HBO",
        "asset": "",
        "debt": "",
        "desc": "",
    }
    exp4 = {
        "date": datetime(2021, 6, 19, 12),
        "amount": float(32.9),
        "type": "utilities",
        "vendor": "AEP",
        "asset": "",
        "debt": "",
        "desc": "",
    }

    Expenses.create(exp1)
    Expenses.create(exp2)
    Expenses.create(exp3)
    Expenses.create(exp4)


def g_inc():
    inc = {
        "date": datetime.now(),
        "amount": float(1848.36),
        "type": "paycheck",
        "source": "DES",
        "deductions": {
            "401k": float(123),
            "tax": float(645),
            "benefits": float(90),
            "other": float(10),
        },
        "asset": "",
        "desc": "",
    }

    Incomes.create(inc)


def g_hour():
    hour = {
        "date": datetime.now(),
        "amount": float(9),
        "source": "DES",
        "desc": "",
    }

    Hours.create(hour)


def g_goal():
    goal = {
        "date": datetime(2021, 6, 1),
        "month": 6,
        "year": 2021,
        "values": {"food": 150.0, "grocery": 400.0},
        "desc": "",
    }

    Goals.create(goal)


def g_nw():
    goal = {
        "date": datetime(2021, 6, 30),
        "month": 6,
        "year": 2021,
        "assets": {"bitcoin": 1800.0, "chevy malibu": 4000.0},
        "debts": {"huntington": 150.0, "tuition": 29000.0},
    }

    Networths.create(goal)


def g_asset():
    asset = {
        "name": "ether",
        "value": float(1800),
        "type": "crypto",
        "shares": 0.04082,
        "price": 37000.00,
        "ticker": "eth",
        "debt": "",
        "desc": "",
    }

    Assets.create(asset)


def g_debt():
    debt1 = {
        "name": "huntington",
        "value": float(150),
        "type": "credit",
        "asset": "",
        "desc": "",
    }
    debt2 = {
        "name": "student loans",
        "value": float(29000),
        "type": "tuition",
        "asset": "",
        "desc": "",
    }

    Debts.create(debt1)
    Debts.create(debt2)


def get_crypto_price(ticker: str):
    return cryptocompare.get_price(ticker.upper(), currency="USD")


def get_stock_price(ticker: str):
    return stock_info.get_live_price(ticker.upper())


def print_all():
    pprint(Expenses.get_all())
    pprint(Incomes.get_all())
    pprint(Hours.get_all())
    pprint(Goals.get_all())
    pprint(Networths.get_all())
    pprint(Assets.get_all())
    pprint(Debts.get_all())


if __name__ == "__main__":
    pass
