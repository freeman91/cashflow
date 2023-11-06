from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

networths = Blueprint("networths", __name__)


@handle_exception
@networths.route("/networths/<user_id>", methods=["POST", "GET"])
def _networths(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [networth.as_dict() for networth in dynamo.networth.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@networths.route("/networths/<user_id>/<networth_id>", methods=["GET", "PUT", "DELETE"])
def _networth(user_id: str, networth_id: str):
    print(f"user_id: {user_id}")
    print(f"networth_id: {networth_id}")
    print(f"request.json: {request.json}")
    if request.method == "GET":
        # return success_result()
        pass

    if request.method == "PUT":
        # return success_result()
        pass

    if request.method == "DELETE":
        # return success_result()
        pass

    return failure_result()
