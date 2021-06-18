from pprint import pprint
from datetime import datetime

from api.db import database as db
from api.db.user import user
from api.db.expenses import Expenses
from api.db.incomes import Incomes
from api.db.hours import Hours
from api.db.assets import Assets
from api.db.debts import Debts
from api.db.goals import Goals
from api.db.networths import Networths


def g_exp():
    exp = {
        "date": datetime.now(),
        "amount": float(7.68),
        "type": "food",
        "vendor": "Raisin Canes",
        "asset": "",
        "debt": "",
        "desc": "",
    }

    Expenses.create(exp)


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
        "mount": 6,
        "year": 2021,
        "values": {"food": 150, "grocery": 400},
        "desc": "",
    }

    Goals.create(goal)


def g_nw():
    goal = {
        "mount": 6,
        "year": 2021,
        "assets": {"bitcoin": 1800, "chevy malibu": 4000},
        "debts": {"huntington": 150, "tuition": 29000},
        "desc": "",
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


def g_debts():
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


if __name__ == "__main__":
    pass
