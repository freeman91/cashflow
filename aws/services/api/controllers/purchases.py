from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

purchases = Blueprint("purchases", __name__)


@handle_exception
@purchases.route("/purchases/<user_id>", methods=["POST", "GET"])
def _purchases(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [purchase.as_dict() for purchase in dynamo.purchase.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@purchases.route("/purchases/<user_id>/<purchase_id>", methods=["GET", "PUT", "DELETE"])
def _purchase(user_id: str, purchase_id: str):
    print(f"user_id: {user_id}")
    print(f"purchase_id: {purchase_id}")
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
