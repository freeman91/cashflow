from datetime import datetime, timedelta, timezone
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
        deposit_account = None
        withdraw_security = None

        sale = Sale.create(
            user_id=user_id,
            _date=_date,
            amount=float(body.get("amount")),
            shares=float(body.get("shares")),
            price=float(body.get("price")),
            security_id=body.get("security_id"),
            account_id=body.get("account_id"),
            merchant=body.get("merchant"),
            fee=float(body.get("fee")),
            deposit_to_id=body.get("deposit_to_id"),
        )

        if sale.security_id:
            withdraw_security = sale.withdraw()
            withdraw_security = withdraw_security.as_dict()

        if sale.deposit_to_id:
            deposit_account = sale.deposit()
            deposit_account = deposit_account.as_dict()

        return success_result(
            {
                "sale": sale.as_dict(),
                "deposit_account": deposit_account,
                "withdraw_security": withdraw_security,
            }
        )

    if request.method == "GET":
        return success_result([sale.as_dict() for sale in Sale.list(user_id=user_id)])
    return failure_result()


@handle_exception
@sales.route("/sales/<user_id>/<sale_id>", methods=["GET", "PUT", "DELETE"])
def _sale(user_id: str, sale_id: str):
    if request.method == "GET":
        start = datetime.strptime(request.args.get("start"), "%Y-%m-%d")
        end = datetime.strptime(request.args.get("end"), "%Y-%m-%d") + timedelta(
            hours=24
        )
        return success_result(
            [
                sale.as_dict()
                for sale in Sale.search(user_id=user_id, start=start, end=end)
            ]
        )

    if request.method == "PUT":
        sale = Sale.get_(user_id=user_id, sale_id=sale_id)
        sale.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")
        sale.amount = float(request.json.get("amount"))
        sale.shares = float(request.json.get("shares"))
        sale.price = float(request.json.get("price"))
        sale.fee = float(request.json.get("fee"))

        for attr in ["account_id", "security_id", "merchant", "deposit_to_id"]:
            setattr(sale, attr, request.json.get(attr))

        sale.last_update = datetime.now(timezone.utc)
        sale.save()
        return success_result(sale.as_dict())

    if request.method == "DELETE":
        Sale.get_(user_id=user_id, sale_id=sale_id).delete()
        return success_result(f"{sale_id} deleted")

    return failure_result()
