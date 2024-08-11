from datetime import datetime
from flask import Blueprint, request

from services.dynamo import Sale
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

sales = Blueprint("sales", __name__)


@handle_exception
@sales.route("/sales/<user_id>", methods=["POST", "GET"])
def _sales(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        sale = Sale.create(
            user_id=user_id,
            _date=_date,
            amount=float(body.get("amount")),
            shares=float(body.get("shares")),
            price=float(body.get("price")),
            asset_id=body.get("asset_id"),
            purchaser=body.get("purchaser"),
        )
        return success_result(sale.as_dict())

    if request.method == "GET":
        return success_result([sale.as_dict() for sale in Sale.list(user_id=user_id)])
    return failure_result()


@handle_exception
@sales.route("/sales/<user_id>/<sale_id>", methods=["GET", "PUT", "DELETE"])
def _sale(user_id: str, sale_id: str):
    if request.method == "GET":
        return success_result(Sale.get_(user_id=user_id, sale_id=sale_id).as_dict())

    if request.method == "PUT":
        sale = Sale.get_(user_id=user_id, sale_id=sale_id)
        sale.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")
        sale.amount = float(request.json.get("amount"))
        sale.shares = float(request.json.get("shares"))
        sale.price = float(request.json.get("price"))

        for attr in ["asset_id", "purchaser"]:
            setattr(sale, attr, request.json.get(attr))

        sale.save()
        return success_result(sale.as_dict())

    if request.method == "DELETE":
        Sale.get_(user_id=user_id, sale_id=sale_id).delete()
        return success_result(f"{sale_id} deleted")

    return failure_result()
