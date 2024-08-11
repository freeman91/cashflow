from flask import Blueprint, request

from services.dynamo import Networth
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

networths = Blueprint("networths", __name__)


@handle_exception
@networths.route("/networths/<user_id>", methods=["POST", "GET"])
def _networths(user_id: str):
    if request.method == "POST":
        pass

    if request.method == "GET":
        return success_result(
            [networth.as_dict() for networth in Networth.list(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@networths.route("/networths/<user_id>/<networth_id>", methods=["GET", "PUT", "DELETE"])
def _networth(user_id: str, networth_id: str):
    if request.method == "GET":
        pass

    if request.method == "PUT":
        pass

    if request.method == "DELETE":
        pass

    return failure_result()
