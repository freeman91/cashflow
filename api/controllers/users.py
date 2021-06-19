from bson.json_util import dumps
from flask import request, Blueprint

from api.db.user import user
from api.controllers.__util__ import serialize_dict

users = Blueprint("users", __name__)


@users.route("/users/user", methods=["GET"])
def get():
    return {"user": serialize_dict(user.item)}, 200


@users.route("/users/update/income/<attr>", methods=["PUT"])
def update_income(attr=None):
    types = request.json
    user.update_income(attr, types)
    return {"user": serialize_dict(user.item)}, 200


@users.route("/users/update/expense/<attr>", methods=["PUT"])
def update_expense(attr=None):
    types = request.json
    user.update_expense(attr, types)
    return {"user": serialize_dict(user.item)}, 200


@users.route("/users/update/asset/<attr>", methods=["PUT"])
def update_asset(attr=None):
    types = request.json
    user.update_asset(attr, types)
    return {"user": serialize_dict(user.item)}, 200


@users.route("/users/update/debt/<attr>", methods=["PUT"])
def update_debt(attr=None):
    types = request.json
    user.update_debt(attr, types)
    return {"user": serialize_dict(user.item)}, 200
