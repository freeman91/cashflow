# pylint: disable=import-error, broad-except
"""Bills controller"""

from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

bills = Blueprint("bills", __name__)


@handle_exception
@bills.route("/bills", methods=["POST", "GET"])
def _bills():
    if request.method == "GET":
        return success_result(mongo.bill.get())
    if request.method == "POST":
        return success_result(mongo.bill.create(request.json))

    return failure_result()


@handle_exception
@bills.route("/bills/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _bills_id(_id: str):
    if request.method == "GET":
        return success_result(mongo.bill.get(_id))

    if request.method == "PUT":
        return success_result(mongo.bill.update(request.json))

    if request.method == "DELETE":
        return success_result(mongo.bill.delete(_id).acknowledged)

    return failure_result()
