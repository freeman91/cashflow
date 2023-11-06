from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

repayments = Blueprint("repayments", __name__)


@handle_exception
@repayments.route("/repayments/<user_id>", methods=["POST", "GET"])
def _repayments(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [repayment.as_dict() for repayment in dynamo.repayment.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@repayments.route(
    "/repayments/<user_id>/<repayment_id>", methods=["GET", "PUT", "DELETE"]
)
def _repayment(user_id: str, repayment_id: str):
    print(f"user_id: {user_id}")
    print(f"repayment_id: {repayment_id}")
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
