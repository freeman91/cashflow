"""Assets controller"""

from flask import Blueprint, request

from services import dynamo
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
        asset = dynamo.asset.create(
            user_id=user_id,
            account_id=body.get("account_id"),
            name=body.get("name"),
            category=body.get("category"),
            value=float(body.get("value")),
            shares=float(body.get("shares")),
            price=float(body.get("price")),
            vendor=body.get("vendor"),
        )
        return success_result(asset.as_dict())

    if request.method == "GET":
        return success_result(
            [asset.as_dict() for asset in dynamo.asset.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@assets.route("/assets/<user_id>/<asset_id>", methods=["GET", "PUT", "DELETE"])
def _asset(user_id: str, asset_id: str):
    if request.method == "GET":
        return success_result(
            dynamo.asset.get(user_id=user_id, asset_id=asset_id).as_dict()
        )

    if request.method == "PUT":
        asset = dynamo.asset.get(user_id=user_id, asset_id=asset_id)

        asset.shares = float(request.json.get("shares"))
        asset.price = float(request.json.get("price"))

        for attr in [
            "account_id",
            "name",
            "category",
            "vendor",
        ]:
            setattr(asset, attr, request.json.get(attr))

        asset.save()
        return success_result(asset.as_dict())

    if request.method == "DELETE":
        dynamo.asset.get(user_id=user_id, asset_id=asset_id).delete()
        return success_result(f"{asset_id} deleted")

    return failure_result()
