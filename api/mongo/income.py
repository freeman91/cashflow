# pylint: disable= missing-function-docstring

"""monog.income submodule"""

from datetime import datetime
from typing import List, Union

from pydash import get as _get

from api.mongo.models.Income import Income
from .connection import database
from .models.common import PydanticObjectId


def get(_id: str = None) -> Union[Income, List[Income]]:
    """
    GET

    mongo.income.get(): returns all incomes
    mongo.income.get("<income_id>"): returns a single income or None if it doesn't exist
    """

    if _id:
        income = database.incomes.find_one({"_id": PydanticObjectId(_id)})
        return Income(**income)

    return [Income(**income) for income in database.incomes.find()]


def search(start: datetime, stop: datetime) -> List[Income]:
    """
    SEARCH

    mongo.income.search(<start>, <stop>): returns all incomes in the given range
    """
    return [
        Income(**income)
        for income in database.incomes.find(
            {
                "date": {
                    "$gt": start,
                    "$lt": stop,
                }
            }
        )
    ]


def create(income: dict) -> Income:
    """
    CREATE

    mongo.income.create(<income>): inserts new income in the db
        - amount: float
        - deductions: dict
        - date: datetime
        - type: str
        - source: str
        - description: str
        - asset: asset_id
    """
    return get(Income(**income).create())


def update(income: dict) -> Income:
    """
    UPDATE

    mongo.income.update(<income>): updates an existing income in the db
        - amount: float
        - deductions: dict
        - date: datetime
        - type: str
        - source: str
        - description: str
        - asset: asset_id
    """

    income_obj = get(_get(income, "id"))
    income_obj.amount = float(_get(income, "amount"))
    income_obj.deductions = _get(income, "deductions")
    income_obj.date = _get(income, "date")
    income_obj.type = _get(income, "type")
    income_obj.source = _get(income, "source")
    income_obj.description = _get(income, "description")
    income_obj.asset = _get(income, "asset")

    income_obj.save()
    return income_obj


def delete(_id: str):
    """
    DELETE

    mongo.income.delete<income_id>): deleted an income in the db if it exists
    """
    return database.incomes.delete_one({"_id": PydanticObjectId(_id)})
