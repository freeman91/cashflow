from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

debts = Blueprint("debts", __name__)


@handle_exception
@debts.route("/debts/<user_id>", methods=["POST", "GET"])
def _debts(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [debt.as_dict() for debt in dynamo.debt.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@debts.route("/debts/<user_id>/<debt_id>", methods=["GET", "PUT", "DELETE"])
def _debt(user_id: str, debt_id: str):
    print(f"user_id: {user_id}")
    print(f"debt_id: {debt_id}")
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
