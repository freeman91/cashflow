# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name, too-many-instance-attributes
"""Expense Model"""

from typing import List, Optional

from pydantic import Field

from .common import BaseModel, PydanticObjectId
from ..connection import database


class User(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    name: str
    email: str
    asset_types: List
    debt_types: List
    expense_types: List
    expense_vendors: List
    income_types: List
    income_sources: List
    income_deductions: List
    goal_categories: list

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

    def __repr__(self):
        return f"<{self.name}>"


user = {
    "_id": "61bab417161ad1abbd958c47",
    "name": "Addison Freeman",
    "email": "addisonmellow@hotmail.com",
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
