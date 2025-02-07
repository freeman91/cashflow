"""Accounts controller"""

from datetime import datetime, timezone
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

        for attr in ["amount", "value", "balance", "interest_rate"]:
            attrVal = body.get(attr)
            if attrVal == "":
                body[attr] = None
            else:
                body[attr] = float(attrVal)

        if Account.name_exists(user_id, body.get("name")):
            return failure_result("Name already exists")

        account = Account.create(
            user_id=user_id,
            name=body.get("name"),
            institution=body.get("institution"),
            url=body.get("url"),
            account_type=body.get("account_type"),
            asset_type=body.get("asset_type"),
            liability_type=body.get("liability_type"),
            subtype=body.get("subtype"),
            description=body.get("description"),
            amount=body.get("amount"),
            value=body.get("value"),
            balance=body.get("balance"),
            interest_rate=body.get("interest_rate"),
            icon_url=body.get("icon_url"),
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

        new_name = request.json.get("name")
        if account.name != new_name and Account.name_exists(user_id, new_name):
            return failure_result("Name already exists")

        account.last_update = datetime.now(timezone.utc)
        for attr in [
            "name",
            "institution",
            "url",
            "active",
            "account_type",
            "asset_type",
            "liability_type",
            "subtype",
            "description",
            "icon_url",
        ]:
            if attr in request.json:
                setattr(account, attr, request.json.get(attr))

        for attr in ["amount", "value", "balance", "interest_rate"]:
            if attr in request.json:
                attrVal = request.json.get(attr)
                if attrVal == "" or attrVal is None:
                    setattr(account, attr, None)
                else:
                    setattr(account, attr, float(attrVal))

        account.last_update = datetime.now(timezone.utc)
        account.save()
        return success_result(account.as_dict())

    if request.method == "DELETE":
        Account.get_(user_id=user_id, account_id=account_id).delete()
        return success_result(f"{account_id} deleted")

    return failure_result()
