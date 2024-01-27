# pylint: disable=wrong-import-position, wrong-import-order, unused-import
"""Dev workbench for aws"""

import os
from datetime import date, datetime, timezone
from pprint import pprint
from time import sleep
from uuid import uuid4

import inquirer
from pydash import find, map_, uniq, sort_by, filter_

import prompts
from services import dynamo
from services.dynamo.models.account import Account
from services.dynamo.models.asset import Asset
from services.dynamo.models.bill import Bill
from services.dynamo.models.borrow import Borrow
from services.dynamo.models.debt import Debt
from services.dynamo.models.expense import Expense
from services.dynamo.models.income import Income
from services.dynamo.models.networth import Networth, AssetMap, DebtMap
from services.dynamo.models.paycheck import Paycheck
from services.dynamo.models.purchase import Purchase
from services.dynamo.models.repayment import Repayment
from services.dynamo.models.sale import Sale


ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


def update_expense_categories():
    return dynamo.categories.get(user_id=USER_ID, category_type="expense")


def test():
    pass


def main():
    pass


OPTIONS = [
    {
        "name": "housing",
        "subcategories": [
            "mortgage",
            "rent",
            "maintenance",
            "renovations",
            "administration",
        ],
    },
    {
        "name": "utility",
        "subcategories": [
            "electric",
            "water",
            "gas",
            "internet",
            "phone",
            "insurance",
        ],
    },
    {
        "name": "transportation",
        "subcategories": [
            "auto loan",
            "maintenance",
            "public",
            "ride-share",
            "gas",
            "parking",
            "bicycle",
            "administration",
            "rental",
        ],
    },
    {
        "name": "food",
        "subcategories": [
            "grocery",
            "fast food",
            "dining",
            "beverage",
            "take out",
            "pet",
        ],
    },
    {
        "name": "health",
        "subcategories": [
            "medical",
            "dental",
            "vision",
            "fitness",
            "pet",
            "medication",
        ],
    },
    {
        "name": "entertainment",
        "subcategories": ["subscription", "activity", "event", "media", "theater"],
    },
    {
        "name": "project",
        "subcategories": ["materials", "tools"],
    },
    {
        "name": "shopping",
        "subcategories": [
            "web purchase",
            "gift",
            "clothing",
            "household",
            "electronics",
            "pet",
            "service",
            "books",
        ],
    },
    {
        "name": "travel",
        "subcategories": ["flight", "accomodation", "activity"],
    },
    {
        "name": "other",
        "subcategories": ["childcare", "student loans", "fun", "administration"],
    },
]
