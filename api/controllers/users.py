from bson.json_util import dumps
from flask import request, Blueprint

from api.db.user import user
from api.controllers.__util__ import serialize_dict, success_result, failure_result

users = Blueprint("users", __name__)


@users.route("/users/user", methods=["GET"])
def get():
    return success_result(user.item)


@users.route("/users/update/income/<attr>", methods=["PUT"])
def update_income(attr=None):
    try:
        types = request.json
        user.update_income(attr, types)
        return success_result(user.item)
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@users.route("/users/update/expense/<attr>", methods=["PUT"])
def update_expense(attr=None):
    try:
        types = request.json
        user.update_expense(attr, types)
        return success_result(user.item)
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@users.route("/users/update/asset/<attr>", methods=["PUT"])
def update_asset(attr=None):
    try:
        types = request.json
        user.update_asset(attr, types)
        return success_result(user.item)
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@users.route("/users/update/debt/<attr>", methods=["PUT"])
def update_debt(attr=None):
    try:
        types = request.json
        user.update_debt(attr, types)
        return success_result(user.item)
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
