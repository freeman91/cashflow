# pylint: disable= missing-function-docstring

"""monog.goal submodule"""

from datetime import datetime
from typing import List, Union

from pydash import get as _get

from api.mongo.models.Goal import Goal
from .connection import database
from .models.common import PydanticObjectId


def get(_id: str = None) -> Union[Goal, List[Goal]]:
    """
    GET

    mongo.goal.get(): returns all goals
    mongo.goal.get("<goal_id>"): returns a single goal or None if it doesn't exist
    """

    if _id:
        goal = database.goals.find_one({"_id": PydanticObjectId(_id)})
        return Goal(**goal)

    return [Goal(**goal) for goal in database.goals.find()]


def search(start: datetime, stop: datetime) -> List[Goal]:
    """
    SEARCH

    mongo.goal.search(<start>, <stop>): returns all goals in the given range
    """
    return [
        Goal(**goal)
        for goal in database.goals.find(
            {
                "date": {
                    "$gt": start,
                    "$lt": stop,
                }
            }
        )
    ]


def create(goal: dict) -> Goal:
    """
    CREATE

    mongo.goal.create(<goal>): inserts new goal in the db
        - date: datetime
        - year: int
        - month: int
        - values: list
        - description: str
    """
    return get(Goal(**goal).create())


def update(goal: dict) -> Goal:
    """
    UPDATE

    mongo.goal.update(<goal>): updates an existing goal in the db
        - date: datetime
        - year: int
        - month: int
        - values: list
        - description: str
    """

    goal_obj = get(_get(goal, "id"))
    goal_obj.date = _get(goal, "date")
    goal_obj.year = _get(goal, "year")
    goal_obj.month = _get(goal, "month")
    goal_obj.values = _get(goal, "values")
    goal_obj.description = _get(goal, "description")

    goal_obj.save()
    return goal_obj


def delete(_id: str):
    """
    DELETE

    mongo.goal.delete<goal_id>): deleted an goal in the db if it exists
    """
    return database.goals.delete_one({"_id": PydanticObjectId(_id)})
