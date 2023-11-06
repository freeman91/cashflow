# pylint: disable=import-error, broad-except
"""Expenses controller"""

from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

expenses = Blueprint("expenses", __name__)


@handle_exception
@expenses.route("/expenses/<user_id>", methods=["POST", "GET"])
def _expenses(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [expense.as_dict() for expense in dynamo.expense.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@expenses.route("/expenses/<user_id>/<expense_id>", methods=["GET", "PUT", "DELETE"])
def _expense(user_id: str, expense_id: str):
    print(f"user_id: {user_id}")
    print(f"expense_id: {expense_id}")
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
