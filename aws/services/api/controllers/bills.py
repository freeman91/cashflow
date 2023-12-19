from datetime import datetime
from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

bills = Blueprint("bills", __name__)


@handle_exception
@bills.route("/bills/<user_id>", methods=["POST", "GET"])
def _bills(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        bill = dynamo.bill.create(
            user_id=user_id,
            _date=_date,
            name=body.get("name"),
            amount=float(body.get("amount")),
            category=body.get("category"),
            vendor=body.get("vendor"),
            rule=body.get("rule"),
            generates_type=body.get("generates_type"),
        )
        return success_result(bill.as_dict())

    if request.method == "GET":
        return success_result(
            [bill.as_dict() for bill in dynamo.bill.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@bills.route("/bills/<user_id>/<bill_id>", methods=["GET", "PUT", "DELETE"])
def _bill(user_id: str, bill_id: str):
    if request.method == "GET":
        return success_result(
            dynamo.bill.get(user_id=user_id, bill_id=bill_id).as_dict()
        )

    if request.method == "PUT":
        bill = dynamo.bill.get(user_id=user_id, bill_id=bill_id)
        bill.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")
        bill.amount = float(request.json.get("amount"))

        for attr in [
            "name",
            "category",
            "vendor",
            "rule",
            "generates_type",
        ]:
            setattr(bill, attr, request.json.get(attr))

        bill.save()
        return success_result(bill.as_dict())

    if request.method == "DELETE":
        dynamo.bill.get(user_id=user_id, bill_id=bill_id).delete()
        return success_result(f"{bill_id} deleted")

    return failure_result()
