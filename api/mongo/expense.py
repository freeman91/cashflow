# pylint: disable= missing-function-docstring

"""monog.expense submodule"""

from datetime import datetime, timedelta
from typing import List, Union

from pydash import get as _get, concat, reduce_, mean

from api import mongo
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


def get_day_expenses(day: datetime):
    start = datetime(day.year, day.month, day.day, 0, 0, 0)
    end = datetime(day.year, day.month, day.day, 23, 59, 59)
    return [
        Expense(**expense)
        for expense in database.expenses.find(
            {
                "date": {
                    "$gt": start,
                    "$lt": end,
                }
            }
        )
    ]


def mean_per_day(start: datetime, end: datetime) -> float:
    sums = []
    current_day = start
    while current_day <= end:
        sums.append(
            reduce_(
                mongo.expense.get_day_expenses(current_day),
                lambda acc, expense: acc + expense.amount,
                0,
            )
        )
        current_day = current_day + timedelta(days=1)

    return mean(sums)


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
        - bill: bill_id
    """

    save_type(_get(expense, "type"))
    save_vendor(_get(expense, "vendor"))
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
        - bill: bill_id
    """

    expense_record = get(_get(expense, "id"))
    expense_record.amount = float(_get(expense, "amount"))
    expense_record.date = _get(expense, "date")
    expense_record.type = _get(expense, "type")
    expense_record.vendor = _get(expense, "vendor")
    expense_record.description = _get(expense, "description")
    expense_record.asset_id = _get(expense, "asset_id")
    expense_record.bill_id = _get(expense, "bill_id")

    save_type(expense_record.type)
    save_vendor(expense_record.vendor)

    expense_record.save()
    return expense_record


def delete(_id: str):
    """
    DELETE

    mongo.expense.delete<expense_id>): delete an expense in the db if it exists
    """
    return database.expenses.delete_one({"_id": PydanticObjectId(_id)})


def save_type(_type: str):
    user = mongo.user.get()
    if _type not in user.expense_types:
        user.update("expense_types", concat(user.expense_types, _type))


def save_vendor(vendor: str):
    user = mongo.user.get()
    if vendor not in user.expense_vendors:
        user.update("expense_vendors", concat(user.expense_vendors, vendor))
