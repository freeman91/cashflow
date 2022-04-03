# pylint: disable= missing-function-docstring

"""monog.expense submodule"""

from datetime import datetime
from typing import List, Union

from pydash import get as _get

from api.mongo.models.Expense import Expense
from .connection import database
from .models.common import PydanticObjectId


def get(_id: str = None) -> Union[Expense, List[Expense]]:
    """
    GET

    mongo.expense.get(): returns all expenses
    mongo.expense.get("<expense_id>"): returns a single expense or None if it doesn't exist
    """

    if _id:
        expense = database.expenses.find_one({"_id": PydanticObjectId(_id)})
        return Expense(**expense)

    return [Expense(**expense) for expense in database.expenses.find()]


def search(start: datetime, stop: datetime) -> List[Expense]:
    """
    SEARCH

    mongo.expense.search(<start>, <stop>): returns all expenses in the given range
    """
    return [
        Expense(**expense)
        for expense in database.expenses.find(
            {
                "date": {
                    "$gt": start,
                    "$lt": stop,
                }
            }
        )
    ]


def create(expense: dict) -> Expense:
    """
    CREATE

    mongo.expense.create(<expense>): inserts new expense in the db
        - amount: float
        - date: datetime
        - type: str
        - vendor: str
        - description: str
        - asset: asset_id
        - debt: debt_id
    """
    return get(Expense(**expense).create())


def update(expense: dict) -> Expense:
    """
    UPDATE

    mongo.expense.update(<expense>): updates an existing expense in the db
        - amount: float
        - date: datetime
        - type: str
        - vendor: str
        - description: str
        - asset: asset_id
        - debt: debt_id
    """

    expense_obj = get(_get(expense, "id"))
    expense_obj.amount = float(_get(expense, "amount"))
    expense_obj.date = _get(expense, "date")
    expense_obj.type = _get(expense, "type")
    expense_obj.vendor = _get(expense, "vendor")
    expense_obj.description = _get(expense, "description")
    expense_obj.asset = _get(expense, "asset")
    expense_obj.debt = _get(expense, "debt")

    expense_obj.save()
    return expense_obj


def delete(_id: str):
    """
    DELETE

    mongo.expense.delete<expense_id>): deleted an expense in the db if it exists
    """
    return database.expenses.delete_one({"_id": PydanticObjectId(_id)})
