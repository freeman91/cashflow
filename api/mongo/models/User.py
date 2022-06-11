# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name, too-many-instance-attributes
"""Expense Model"""

import calendar
from datetime import datetime, timedelta
from typing import List, Optional

from pydantic import Field

from api import mongo

from .common import BaseModel, PydanticObjectId
from ..connection import database


class User(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    name: str
    email: str
    average: float
    asset_types: List
    debt_types: List
    expense_types: List
    expense_vendors: List
    income_types: List
    income_sources: List
    income_deductions: List
    goal_categories: list

    def __repr__(self):
        return f"<{self.name}>"

    def save(self):
        return database.users.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def update(self, setting: str, arr: List):
        arr.sort()
        if setting == "asset_types":
            self.asset_types = arr
        elif setting == "debt_types":
            self.debt_types = arr
        elif setting == "expense_types":
            self.expense_types = arr
        elif setting == "expense_vendors":
            self.expense_vendors = arr
        elif setting == "income_types":
            self.income_types = arr
        elif setting == "income_sources":
            self.income_sources = arr
        elif setting == "income_deductions":
            self.income_deductions = arr
        elif setting == "goal_categories":
            self.goal_categories = arr

        return self.save()

    def set_average(self):
        yesterday = datetime.now()

        # overall
        start1 = datetime(2018, 11, 19, 12, 0)
        mean_overall = mongo.expense.mean_per_day(start1, yesterday)

        # 120 days
        start2 = yesterday - timedelta(days=120)
        mean_120 = mongo.expense.mean_per_day(start2, yesterday)

        # 30 days
        start3 = yesterday - timedelta(days=30)
        mean_30 = mongo.expense.mean_per_day(start3, yesterday)

        # this month last year
        last_year = datetime(yesterday.year - 1, yesterday.month, yesterday.day)
        fdom, ldom = calendar.monthrange(last_year.year, last_year.month)
        mean_ly = mongo.expense.mean_per_day(
            last_year.replace(day=fdom), last_year.replace(day=ldom)
        )

        self.average = (
            (mean_overall * 0.2) + (mean_120 * 0.2) + (mean_30 * 0.3) + (mean_ly * 0.3)
        )
        self.save()


user = {
    "_id": "61bab417161ad1abbd958c47",
    "name": "Addison Freeman",
    "email": "addisonmellow@hotmail.com",
    "average": 110,
    "asset_types": [
        "cash",
        "checking",
        "crypto",
        "owed",
        "property",
        "retirement",
        "savings",
        "stock",
        "vehicle",
    ],
    "debt_types": ["credit", "loan", "tuition"],
    "expense_types": [
        "asset",
        "home",
        "wood",
        "other",
        "food",
        "grocery",
        "fitness",
        "rent",
        "mortgage",
        "tax",
        "entertainment",
        "utility",
    ],
    "expense_vendors": [
        "Mama Mimi's",
        "robinhood",
        "Chipotle",
        "Home Depot",
        "Amazon",
        "BlockFi",
        "Bonifacio",
        "Lowes",
        "Bamboo Thai",
        "Kroger",
        "Marathon",
        "Spectrum",
        "Apple",
        "HBO",
        "Petco",
        "Raisin Canes",
        "Huntington",
        "Hot Chicken Takeover",
        "Homage",
        "Budd Dairy",
        "Warby Parker",
    ],
    "goal_categories": [
        "housing",
        "utilities",
        "debt",
        "transportation",
        "grocery",
        "dining",
        "health",
        "entertainment",
        "pets",
        "personal",
        "home",
        "fitness",
        "investments",
        "other",
    ],
    "income_deductions": ["401k", "tax", "benefits", "other"],
    "income_sources": [
        "des",
        "government",
        "broker",
        "other",
        "bucket",
        "scos",
        "bank",
        "Government",
        "Huntington",
        "Golden Title Agency",
        "veregy",
        "Ohio Government",
    ],
    "income_types": ["paycheck", "sale", "refund", "gift"],
}
