# pylint: disable=wrong-import-position, wrong-import-order, unused-import
"""Dev workbench for aws"""

import os
from datetime import date, datetime, timezone
from pprint import pprint
from time import sleep
from uuid import uuid4
from pydash import find, map_


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

OPTIONS = [
    {
        "name": "housing",
        "subcategories": ["mortgage", "maintenance", "renovations"],
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
            "bicycle",
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
        "subcategories": ["medical", "dental", "vision", "fitness", "pet"],
    },
    {
        "name": "entertainment",
        "subcategories": ["subscription", "event", "media", "theater"],
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
        ],
    },
    {
        "name": "travel",
        "subcategories": ["flight", "accomodation", "activity"],
    },
    {
        "name": "other",
        "subcategories": ["childcare", "student loans", "fun"],
    },
]


CATS = {
    "NelNet": {"category": "other", "subcategory": "student loans"},
    "Wells Fargo": {"category": "transportation", "subcategory": "auto payment"},
    "Huntington": {"category": "housing", "subcategory": "mortgage"},
    "MOHELA": {"category": "other", "subcategory": "student loans"},
    "Great Lakes": {"category": "other", "subcategory": "student loans"},
}


def _test():
    start = datetime(2021, 12, 16)
    end = datetime(2021, 12, 19)
    return dynamo.expense.search(user_id=USER_ID, start=start, end=end)


def test():
    def find_cats(lender: str):
        cats = CATS[lender]
        return cats["category"], cats["subcategory"]

    _repayments = []

    repayments = dynamo.repayment.get(user_id=USER_ID)
    for repayment in repayments:
        category, subcategory = find_cats(repayment.lender)
        repayment.category = category
        repayment.subcategory = subcategory
        _repayments.append(repayment)

        pprint(repayment.as_dict())

    with Repayment.batch_write() as batch:
        for repayment in _repayments:
            batch.save(repayment)


def main():
    pass
