# pylint: disable=import-error, broad-except
"""Goal controller"""

from datetime import datetime
from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    set_date,
    success_result,
)

goals = Blueprint("goals", __name__)


@handle_exception
@goals.route("/goals", methods=["POST", "GET"])
def _create_goal():
    if request.method == "GET":
        return success_result(mongo.goal.get())
    if request.method == "POST":
        return success_result(mongo.goal.create(set_date(request.json)))


@handle_exception
@goals.route("/goals/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _goals(_id: str):
    if request.method == "GET":
        return success_result(mongo.goal.get(_id))

    if request.method == "PUT":
        return success_result(mongo.goal.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.goal.delete(_id).acknowledged)

    return failure_result()


@handle_exception
@goals.route("/goals/range/<start>/<stop>", methods=["GET"])
def _fetch_goals_in_range(start: str, stop: str):

    if not (start.isnumeric() and stop.isnumeric()):
        return failure_result("Invalid range")

    return success_result(
        mongo.goal.search(
            datetime.fromtimestamp(int(start)), datetime.fromtimestamp(int(stop))
        )
    )
