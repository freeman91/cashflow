# pylint: disable=import-error, broad-except
"""Incomes controller"""

from datetime import datetime
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
@incomes.route("/incomes", methods=["POST", "GET"])
def _incomes():
    if request.method == "GET":
        return success_result(
            mongo.income.search(
                datetime.fromtimestamp(int(request.args.get("start"))),
                datetime.fromtimestamp(int(request.args.get("stop"))),
            )
        )
    if request.method == "POST":
        return success_result(mongo.income.create(set_date(request.json)))

    return failure_result()


@handle_exception
@incomes.route("/incomes/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _incomes_id(_id: str):
    if request.method == "GET":
        return success_result(mongo.income.get(_id))

    if request.method == "PUT":
        return success_result(mongo.income.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.income.delete(_id).acknowledged)

    return failure_result()
