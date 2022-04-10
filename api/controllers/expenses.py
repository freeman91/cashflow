# pylint: disable=import-error, broad-except
"""Expenses controller"""

from datetime import datetime
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
@expenses.route("/expenses", methods=["POST", "GET"])
def _expenses():
    if request.method == "GET":
        return success_result(
            mongo.expense.search(
                datetime.fromtimestamp(int(request.args.get("start"))),
                datetime.fromtimestamp(int(request.args.get("stop"))),
            )
        )
    if request.method == "POST":
        return success_result(mongo.expense.create(set_date(request.json)))

    return failure_result()


@handle_exception
@expenses.route("/expenses/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _expenses_id(_id: str):
    if request.method == "GET":
        return success_result(mongo.expense.get(_id))

    if request.method == "PUT":
        return success_result(mongo.expense.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.expense.delete(_id).acknowledged)

    return failure_result()
