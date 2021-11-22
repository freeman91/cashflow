import os
from pprint import pprint
from datetime import datetime

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


def g_goal():
    goal = {
        "date": datetime(2021, 6, 1),
        "month": 6,
        "year": 2021,
        "values": {"food": 150.0, "grocery": 400.0},
        "description": "",
    }

    Goals.create(goal)


def g_nw():
    nw = {
        "date": datetime(2021, 6, 30),
        "month": 6,
        "year": 2021,
        "assets": {"bitcoin": 1800.0, "chevy malibu": 4000.0},
        "debts": {"huntington": 150.0, "tuition": 29000.0},
    }

    Networths.create(nw)


def delete_all():
    Expenses.delete_all()
    Incomes.delete_all()
    Hours.delete_all()


def print_all():
    pprint(Expenses.get_all())
    pprint(Incomes.get_all())
    pprint(Hours.get_all())
    pprint(Goals.get_all())
    pprint(Networths.get_all())
    pprint(Assets.get_all())
    pprint(Debts.get_all())


goal = {
    "date": datetime(2021, 11, 15),
    "month": 11,
    "year": 2021,
    "values": {
        "Housing": 1340.00,
        "Utilities": 100.00,
        "Debt": 300.00,
        "Transportation": 100.00,
        "Grocery": 400.00,
        "Dining": 200.00,
        "Health Care": 50.00,
        "Entertainment": 50.00,
        "Pets": 50.00,
        "Personal": 200.00,
        "Home": 200.00,
        "Fitness": 100.00,
        "Investments": 300.00,
        "Other": 100.00,
    },
    "description": "",
}


def exec():
    res = Goals.create(goal)
    print(f"res: {res}")


if __name__ == "__main__":
    pass
