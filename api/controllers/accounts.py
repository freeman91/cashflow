# pylint: disable=import-error, broad-except
"""Networths controller"""

from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    set_last_update,
    success_result,
)

accounts = Blueprint("accounts", __name__)


@handle_exception
@accounts.route("/accounts", methods=["POST", "GET"])
def _accounts():
    if request.method == "POST":
        return success_result(mongo.account.create(set_last_update(request.json)))
    if request.method == "GET":
        res = mongo.account.get()
        return success_result(res)
    return failure_result()


@handle_exception
@accounts.route("/accounts/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _account(_id: str):
    if request.method == "GET":
        return success_result(mongo.account.get(_id))

    if request.method == "PUT":
        return success_result(mongo.account.update(request.json))

    if request.method == "DELETE":
        return success_result(mongo.account.delete(_id).acknowledged)

    return failure_result()
