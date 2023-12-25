"""User controller"""

from flask import request, Blueprint

from services import dynamo
from services.api.controllers.__util__ import success_result, failure_result

users = Blueprint("users", __name__)


@users.route("/users/<user_id>", methods=["GET", "PUT"])
def user_route(user_id: str):
    if request.method == "GET":
        user_dict = dynamo.user.get(user_id).as_dict()
        del user_dict["password"]

        return success_result(user_dict)

    if request.method == "PUT":
        user_dict = dynamo.user.update(user_id, request.json).as_dict()
        del user_dict["password"]

        return success_result(user_dict)

    return failure_result("Not Found")
