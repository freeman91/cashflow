from pprint import pprint
from datetime import datetime

from api.db import database as db
from api.db.user import user
from api.db.expenses import Expense, Expenses
from api.db.incomes import Income, Incomes
from api.db.hours import Hour, Hours
from api.db.assets import Asset, Assets
from api.db.debts import Debt, Debts


def g_exp():
    exp = {
        "date": datetime.now(),
        "amount": 45.15,
        "type": "grocery",
        "vendor": "Kroger",
        "asset": "",
        "debt": "",
        "desc": "",
    }

    Expense.create(exp)


if __name__ == "__main__":
    pass
