# pylint: disable= missing-function-docstring

"""monog.hour submodule"""

from datetime import datetime
from typing import List, Union

from pydash import get as _get

from api.mongo.models.Hour import Hour
from .connection import database
from .models.common import PydanticObjectId


def get(_id: str = None) -> Union[Hour, List[Hour]]:
    """
    GET

    mongo.hour.get(): returns all hours
    mongo.hour.get("<hour_id>"): returns a single hour or None if it doesn't exist
    """

    if _id:
        hour = database.hours.find_one({"_id": PydanticObjectId(_id)})
        return Hour(**hour)

    return [Hour(**hour) for hour in database.hours.find()]


def search(start: datetime, stop: datetime) -> List[Hour]:
    """
    SEARCH

    mongo.hour.search(<start>, <stop>): returns all hours in the given range
    """
    return [
        Hour(**hour)
        for hour in database.hours.find(
            {
                "date": {
                    "$gt": start,
                    "$lt": stop,
                }
            }
        )
    ]


def create(hour: dict) -> Hour:
    """
    CREATE

    mongo.hour.create(<hour>): inserts new hour in the db
        - amount: float
        - date: datetime
        - source: str
        - description: str
    """
    return get(Hour(**hour).create())


def update(hour: dict) -> Hour:
    """
    UPDATE

    mongo.hour.update(<hour>): updates an existing hour in the db
        - amount: float
        - date: datetime
        - source: str
        - description: str
    """

    hour_obj = get(_get(hour, "id"))
    hour_obj.amount = float(_get(hour, "amount"))
    hour_obj.date = _get(hour, "date")
    hour_obj.source = _get(hour, "source")
    hour_obj.description = _get(hour, "description")

    hour_obj.save()
    return hour_obj


def delete(_id: str):
    """
    DELETE

    mongo.hour.delete<hour_id>): deleted an hour in the db if it exists
    """
    return database.hours.delete_one({"_id": PydanticObjectId(_id)})
