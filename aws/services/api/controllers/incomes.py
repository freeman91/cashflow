from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

incomes = Blueprint("incomes", __name__)


@handle_exception
@incomes.route("/incomes/<user_id>", methods=["POST", "GET"])
def _incomes(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [income.as_dict() for income in dynamo.income.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@incomes.route("/incomes/<user_id>/<income_id>", methods=["GET", "PUT", "DELETE"])
def _income(user_id: str, income_id: str):
    print(f"user_id: {user_id}")
    print(f"income_id: {income_id}")
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
