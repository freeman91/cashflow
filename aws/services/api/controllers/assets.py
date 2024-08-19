"""Assets controller"""

from flask import Blueprint, request

from services.dynamo import Asset
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

assets = Blueprint("assets", __name__)


@handle_exception
@assets.route("/assets/<user_id>", methods=["POST", "GET"])
def _assets(user_id: str):
    if request.method == "POST":
        body = request.json
        asset = Asset.create(
            user_id=user_id,
            account_id=body.get("account_id"),
            name=body.get("name"),
            category=body.get("category"),
            value=float(body.get("value")),
            shares=float(body.get("shares") or 0),
            price=float(body.get("price") or 0),
            can_deposit_to=body.get("can_deposit_to", False),
            can_pay_from=body.get("can_pay_from", False),
        )
        return success_result(asset.as_dict())

    if request.method == "GET":
        return success_result(
            [asset.as_dict() for asset in Asset.list(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@assets.route("/assets/<user_id>/<asset_id>", methods=["GET", "PUT", "DELETE"])
def _asset(user_id: str, asset_id: str):
    if request.method == "GET":
        return success_result(Asset.get_(user_id=user_id, asset_id=asset_id).as_dict())

    if request.method == "PUT":
        asset = Asset.get_(user_id=user_id, asset_id=asset_id)

        asset.value = float(request.json.get("value"))
        asset.shares = float(request.json.get("shares") or 0)
        asset.price = float(request.json.get("price") or 0)

        for attr in [
            "account_id",
            "name",
            "category",
            "can_deposit_to",
            "can_pay_from",
        ]:
            setattr(asset, attr, request.json.get(attr))

        asset.save()
        return success_result(asset.as_dict())

    if request.method == "DELETE":
        Asset.get_(user_id=user_id, asset_id=asset_id).delete()
        return success_result(f"{asset_id} deleted")

    return failure_result()
