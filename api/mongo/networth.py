# pylint: disable= missing-function-docstring

"""monog.networth submodule"""

from datetime import datetime
from typing import List, Union

from pydash import get as _get

from api.mongo.models.Networth import Networth
from .connection import database
from .models.common import PydanticObjectId


def get(
    _id: str = None, year: int = None, month: int = None
) -> Union[Networth, List[Networth]]:
    """
    GET

    mongo.networth.get(): returns all networths
    mongo.networth.get("<networth_id>"): returns a single networth or None if it doesn't exist
    """

    if _id:
        return Networth(**database.networths.find_one({"_id": PydanticObjectId(_id)}))

    if year and month:
        networth = database.networths.find_one({"year": year, "month": month})
        return Networth(**networth) if networth else None

    return [Networth(**networth) for networth in database.networths.find()]


def search(start: datetime, stop: datetime) -> List[Networth]:
    """
    SEARCH

    mongo.networth.search(<start>, <stop>): returns all networths in the given range
    """
    return [
        Networth(**networth)
        for networth in database.networths.find(
            {
                "date": {
                    "$gt": start,
                    "$lt": stop,
                }
            }
        )
    ]


def create(networth: dict) -> Networth:
    """
    CREATE

    mongo.networth.create(<networth>): inserts new networth in the db
        - date: datetime
        - year: int
        - month: int
        - assets: list
        - debts: list
    """
    return get(Networth(**networth).create())


def update(networth: dict) -> Networth:
    """
    UPDATE

    mongo.networth.update(<networth>): updates an existing networth in the db
        - date: datetime
        - year: int
        - month: int
        - assets: list
        - debts: list
    """

    networth_obj = get(_get(networth, "id"))
    networth_obj.date = _get(networth, "date")
    networth_obj.year = _get(networth, "year")
    networth_obj.month = _get(networth, "month")
    networth_obj.assets = _get(networth, "assets")
    networth_obj.debts = _get(networth, "debts")

    networth_obj.save()
    return networth_obj


def delete(_id: str):
    """
    DELETE

    mongo.networth.delete<networth_id>): deleted an networth in the db if it exists
    """
    return database.networths.delete_one({"_id": PydanticObjectId(_id)})
