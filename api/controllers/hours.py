# pylint: disable=import-error, broad-except
"""Hours controller"""

from datetime import datetime
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
@hours.route("/hours", methods=["POST", "GET"])
def _hours():
    if request.method == "GET":
        return success_result(
            mongo.hour.search(
                datetime.fromtimestamp(int(request.args.get("start"))),
                datetime.fromtimestamp(int(request.args.get("stop"))),
            )
        )
    if request.method == "POST":
        return success_result(mongo.hour.create(set_date(request.json)))

    return failure_result()


@handle_exception
@hours.route("/hours/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _hours_id(_id: str):
    if request.method == "GET":
        return success_result(mongo.hour.get(_id))

    if request.method == "PUT":
        return success_result(mongo.hour.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.hour.delete(_id).acknowledged)

    return failure_result()
