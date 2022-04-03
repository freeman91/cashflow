# pylint: disable=import-error, broad-except
"""Hours controller"""

from datetime import datetime, timedelta
from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    set_date,
    success_result,
)

hours = Blueprint("hours", __name__)


@handle_exception
@hours.route("/hours/recent", methods=["GET"])
def _fetch_recent_hours():
    stop = datetime.now() + timedelta(days=1)
    return success_result(mongo.hour.search(stop - timedelta(days=20), stop))


@handle_exception
@hours.route("/hours", methods=["POST"])
def _create_hour():
    return success_result(mongo.hour.create(set_date(request.json)))


@handle_exception
@hours.route("/hours/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _hours(_id: str):
    if request.method == "GET":
        return success_result(mongo.hour.get(_id))

    if request.method == "PUT":
        return success_result(mongo.hour.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.hour.delete(_id).acknowledged)

    return failure_result()


@handle_exception
@hours.route("/hours/range/<start>/<stop>", methods=["GET"])
def _fetch_hours_in_range(start: str, stop: str):

    if not (start.isnumeric() and stop.isnumeric()):
        return failure_result("Invalid range")

    return success_result(
        mongo.hour.search(
            datetime.fromtimestamp(int(start)), datetime.fromtimestamp(int(stop))
        )
    )
