from flask import Blueprint, request

from services.dynamo import Bill
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
        escrow = body.get("escrow")
        if escrow:
            escrow = float(escrow)
        else:
            escrow = 0

        bill = Bill.create(
            user_id=user_id,
            name=body.get("name"),
            amount=float(body.get("amount")),
            escrow=escrow,
            category=body.get("category"),
            subcategory=body.get("subcategory"),
            merchant=body.get("merchant"),
            day=body.get("day"),
            months=body.get("months"),
            account_id=body.get("account_id"),
            payment_from_id=body.get("payment_from_id"),
        )
        return success_result(bill.as_dict())

    if request.method == "GET":
        return success_result([bill.as_dict() for bill in Bill.list(user_id=user_id)])
    return failure_result()


@handle_exception
@bills.route("/bills/<user_id>/<bill_id>", methods=["GET", "PUT", "DELETE"])
def _bill(user_id: str, bill_id: str):
    if request.method == "GET":
        return success_result(Bill.get_(user_id=user_id, bill_id=bill_id).as_dict())

    if request.method == "PUT":
        bill = Bill.get_(user_id=user_id, bill_id=bill_id)

        payload = request.json
        bill.amount = float(payload.get("amount"))

        if hasattr(payload, "escrow"):
            bill.escrow = float(payload.get("escrow"))

        for attr in [
            "name",
            "category",
            "subcategory",
            "merchant",
            "day",
            "months",
            "account_id",
            "payment_from_id",
        ]:
            setattr(bill, attr, payload.get(attr))

        bill.save()
        return success_result(bill.as_dict())

    if request.method == "DELETE":
        Bill.get_(user_id=user_id, bill_id=bill_id).delete()
        return success_result(f"{bill_id} deleted")

    return failure_result()
