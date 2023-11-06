from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

bills = Blueprint("bills", __name__)


@handle_exception
@bills.route("/bills/<user_id>", methods=["POST", "GET"])
def _bills(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [bill.as_dict() for bill in dynamo.bill.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@bills.route("/bills/<user_id>/<bill_id>", methods=["GET", "PUT", "DELETE"])
def _bill(user_id: str, bill_id: str):
    print(f"user_id: {user_id}")
    print(f"bill_id: {bill_id}")
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
