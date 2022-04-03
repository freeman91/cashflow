# pylint: disable=import-error, broad-except
"""Expenses controller"""

from datetime import datetime, timedelta
from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    set_date,
    success_result,
)

expenses = Blueprint("expenses", __name__)


@handle_exception
@expenses.route("/expenses/recent", methods=["GET"])
def _fetch_recent_expenses():
    stop = datetime.now() + timedelta(days=1)
    return success_result(mongo.expense.search(stop - timedelta(days=20), stop))


@handle_exception
@expenses.route("/expenses", methods=["POST"])
def _create_expense():
    return success_result(mongo.expense.create(set_date(request.json)))


@handle_exception
@expenses.route("/expenses/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _expenses(_id: str):
    if request.method == "GET":
        return success_result(mongo.expense.get(_id))

    if request.method == "PUT":
        return success_result(mongo.expense.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.expense.delete(_id).acknowledged)

    return failure_result()


@handle_exception
@expenses.route("/expenses/range/<start>/<stop>", methods=["GET"])
def _fetch_expenses_in_range(start: str, stop: str):

    if not (start.isnumeric() and stop.isnumeric()):
        return failure_result("Invalid range")

    return success_result(
        mongo.expense.search(
            datetime.fromtimestamp(int(start)), datetime.fromtimestamp(int(stop))
        )
    )
