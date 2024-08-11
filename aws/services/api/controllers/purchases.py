from datetime import datetime
from flask import Blueprint, request

from services.dynamo import Purchase
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

purchases = Blueprint("purchases", __name__)


@handle_exception
@purchases.route("/purchases/<user_id>", methods=["POST", "GET"])
def _purchases(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        purchase = Purchase.create(
            user_id=user_id,
            _date=_date,
            amount=float(body.get("amount")),
            shares=float(body.get("shares")),
            price=float(body.get("price")),
            vendor=body.get("vendor"),
            asset_id=body.get("asset_id"),
        )
        return success_result(purchase.as_dict())

    if request.method == "GET":
        return success_result(
            [purchase.as_dict() for purchase in Purchase.list(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@purchases.route("/purchases/<user_id>/<purchase_id>", methods=["GET", "PUT", "DELETE"])
def _purchase(user_id: str, purchase_id: str):
    if request.method == "GET":
        return success_result(
            Purchase.get_(user_id=user_id, purchase_id=purchase_id).as_dict()
        )

    if request.method == "PUT":
        purchase = Purchase.get_(user_id=user_id, purchase_id=purchase_id)
        purchase.date = datetime.strptime(
            request.json["date"][:19], "%Y-%m-%dT%H:%M:%S"
        )
        purchase.amount = float(request.json.get("amount"))
        purchase.shares = float(request.json.get("shares"))
        purchase.price = float(request.json.get("price"))

        for attr in ["asset_id", "vendor"]:
            setattr(purchase, attr, request.json.get(attr))

        purchase.save()
        return success_result(purchase.as_dict())

    if request.method == "DELETE":
        Purchase.get_(user_id=user_id, purchase_id=purchase_id).delete()
        return success_result(f"{purchase_id} deleted")

    return failure_result()
