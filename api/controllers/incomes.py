# pylint: disable=import-error, broad-except
"""Incomes controller"""

from datetime import datetime, timedelta
from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    set_date,
    success_result,
)

incomes = Blueprint("incomes", __name__)


@handle_exception
@incomes.route("/incomes/recent", methods=["GET"])
def _fetch_recent_incomes():
    stop = datetime.now() + timedelta(days=1)
    return success_result(mongo.income.search(stop - timedelta(days=20), stop))


@handle_exception
@incomes.route("/incomes", methods=["POST"])
def _create_income():
    return success_result(mongo.income.create(set_date(request.json)))


@handle_exception
@incomes.route("/incomes/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _incomes(_id: str):
    if request.method == "GET":
        return success_result(mongo.income.get(_id))

    if request.method == "PUT":
        return success_result(mongo.income.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.income.delete(_id).acknowledged)

    return failure_result()


@handle_exception
@incomes.route("/incomes/range/<start>/<stop>", methods=["GET"])
def _fetch_incomes_in_range(start: str, stop: str):

    if not (start.isnumeric() and stop.isnumeric()):
        return failure_result("Invalid range")

    return success_result(
        mongo.income.search(
            datetime.fromtimestamp(int(start)), datetime.fromtimestamp(int(stop))
        )
    )
