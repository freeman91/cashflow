# pylint: disable=import-error, broad-except
"""Networths controller"""

from datetime import datetime
from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    set_date,
    success_result,
)

networths = Blueprint("networths", __name__)


@handle_exception
@networths.route("/networths", methods=["POST", "GET"])
def _networths():
    if request.method == "POST":
        return success_result(mongo.networth.create(set_date(request.json)))
    if request.method == "GET":
        return success_result(mongo.networth.get())
    return failure_result()


@handle_exception
@networths.route("/networths/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _networth(_id: str):
    if request.method == "GET":
        return success_result(mongo.networth.get(_id))

    if request.method == "PUT":
        return success_result(mongo.networth.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.networth.delete(_id).acknowledged)

    return failure_result()


@handle_exception
@networths.route("/networths/range/<start>/<stop>", methods=["GET"])
def _fetch_networths_in_range(start: str, stop: str):

    if not (start.isnumeric() and stop.isnumeric()):
        return failure_result("Invalid range")

    return success_result(
        mongo.networth.search(
            datetime.fromtimestamp(int(start)), datetime.fromtimestamp(int(stop))
        )
    )
