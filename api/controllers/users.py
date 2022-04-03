# pylint: disable=import-error, missing-function-docstring
"""User controller"""

from flask import request, Blueprint
from pydash import get

from api import mongo
from api.controllers.__util__ import success_result, failure_result


users = Blueprint("users", __name__)


@users.route("/user", methods=["GET", "PUT"])
def user_route():
    if request.method == "GET":
        return success_result(mongo.user.get())

    if request.method == "PUT":
        payload = request.json

        updated_list = get(payload, "updated")
        setting = get(payload, "setting")

        user = mongo.user.get()
        user.update(setting, updated_list)

        return success_result(mongo.user.get())

    return failure_result("Not Found")
