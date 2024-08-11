"""Accounts controller"""

from flask import Blueprint, request

from services.dynamo import Account
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)


accounts = Blueprint("accounts", __name__)


@handle_exception
@accounts.route("/accounts/<user_id>", methods=["POST", "GET"])
def _accounts(user_id: str):
    if request.method == "POST":
        body = request.json
        account = Account.create(
            user_id=user_id,
            name=body.get("name"),
            url=body.get("url"),
            account_type=body.get("account_type"),
            description=body.get("description"),
        )
        return success_result(account.as_dict())

    if request.method == "GET":
        return success_result(
            [account.as_dict() for account in Account.list(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@accounts.route("/accounts/<user_id>/<account_id>", methods=["GET", "PUT", "DELETE"])
def _account(user_id: str, account_id: str):
    if request.method == "GET":
        return success_result(
            Account.get_(user_id=user_id, account_id=account_id).as_dict()
        )

    if request.method == "PUT":
        account = Account.get_(user_id=user_id, account_id=account_id)

        for attr in ["name", "url", "account_type", "description"]:
            setattr(account, attr, request.json.get(attr))

        account.save()
        return success_result(account.as_dict())

    if request.method == "DELETE":
        Account.get_(user_id=user_id, account_id=account_id).delete()
        return success_result(f"{account_id} deleted")

    return failure_result()
