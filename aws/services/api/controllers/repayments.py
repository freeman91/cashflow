from datetime import datetime
from flask import Blueprint, request

from services.dynamo import Repayment
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

repayments = Blueprint("repayments", __name__)


@handle_exception
@repayments.route("/repayments/<user_id>", methods=["POST", "GET"])
def _repayments(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        escrow = body.get("escrow")

        repayment = Repayment.create(
            user_id=user_id,
            _date=_date,
            principal=float(body.get("principal")),
            interest=float(body.get("interest")),
            escrow=float(escrow) if escrow else None,
            lender=body.get("lender"),
            category=body.get("category"),
            subcategory=body.get("subcategory"),
            debt_id=body.get("debt_id"),
            bill_id=body.get("bill_id"),
            payment_from_id=body.get("payment_from_id"),
            pending=body.get("pending", True),
        )

        subaccount = None
        if not repayment.pending and repayment.payment_from_id:
            subaccount = repayment.update_subaccount()
            if subaccount:
                subaccount = subaccount.as_dict()

        return success_result(
            {"repayment": repayment.as_dict(), "subaccount": subaccount}
        )

    if request.method == "GET":
        return success_result(
            [repayment.as_dict() for repayment in Repayment.list(user_id=user_id)]
        )

    return failure_result()


@handle_exception
@repayments.route(
    "/repayments/<user_id>/<repayment_id>", methods=["GET", "PUT", "DELETE"]
)
def _repayment(user_id: str, repayment_id: str):
    if request.method == "GET":
        return success_result(
            Repayment.get_(user_id=user_id, repayment_id=repayment_id).as_dict()
        )

    if request.method == "PUT":
        repayment = Repayment.get_(user_id=user_id, repayment_id=repayment_id)
        repayment.date = datetime.strptime(
            request.json["date"][:19], "%Y-%m-%dT%H:%M:%S"
        )

        prev_pending = repayment.pending
        escrow = request.json.get("escrow")
        repayment.principal = float(request.json.get("principal"))
        repayment.interest = float(request.json.get("interest"))
        repayment.escrow = float(escrow) if escrow else None

        for attr in [
            "lender",
            "category",
            "subcategory",
            "debt_id",
            "bill_id",
            "payment_from_id",
            "pending",
        ]:
            setattr(repayment, attr, request.json.get(attr))
        repayment.save()

        subaccount = None
        debt = None
        if prev_pending is True and repayment.pending is False:
            # update payment subaccount
            subaccount = repayment.update_subaccount()
            subaccount = subaccount.as_dict()

            # update debt principal
            debt = repayment.update_debt_principal()
            debt = debt.as_dict()

        return success_result(
            {"repayment": repayment.as_dict(), "subaccount": subaccount, "debt": debt}
        )

    if request.method == "DELETE":
        Repayment.get_(user_id=user_id, repayment_id=repayment_id).delete()
        return success_result(f"{repayment_id} deleted")

    return failure_result()
