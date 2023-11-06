"""Accounts controller"""

from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)


accounts = Blueprint("accounts", __name__)


@handle_exception
@accounts.route("/accounts/<user_id>", methods=["POST", "GET"])
def _accounts(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [account.as_dict() for account in dynamo.account.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@accounts.route("/accounts/<user_id>/<account_id>", methods=["GET", "PUT", "DELETE"])
def _account(user_id: str, account_id: str):
    print(f"user_id: {user_id}")
    print(f"account_id: {account_id}")
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
