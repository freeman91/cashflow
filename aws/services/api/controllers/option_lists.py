from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

option_lists = Blueprint("option_lists", __name__)


@handle_exception
@option_lists.route("/option_lists/<user_id>", methods=["POST", "GET"])
def _option_lists(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        pass

    if request.method == "GET":
        return success_result(
            [
                option_list.as_dict()
                for option_list in dynamo.option_list.get(user_id=user_id)
            ]
        )
    return failure_result()


@handle_exception
@option_lists.route(
    "/option_lists/<user_id>/<option_type>", methods=["GET", "POST", "PUT", "DELETE"]
)
def _option_list(user_id: str, option_type: str):
    if request.method == "GET":
        pass

    if request.method == "POST":
        option_list = dynamo.option_list.create(
            user_id=user_id,
            option_type=option_type,
            options=request.json.get("options"),
        )

        return success_result(option_list.as_dict())

    if request.method == "PUT":
        option_list = dynamo.option_list.get(user_id=user_id, option_type=option_type)
        option_list.options = request.json.get("options")
        option_list.save()

        return success_result(option_list.as_dict())

    if request.method == "DELETE":
        pass

    return failure_result()
