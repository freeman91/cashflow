from datetime import datetime, timezone
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
        account = None
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        escrow = body.get("escrow")

        repayment = Repayment.create(
            user_id=user_id,
            _date=_date,
            pending=body.get("pending"),
            principal=float(body.get("principal")),
            interest=float(body.get("interest")),
            escrow=float(escrow) if escrow else None,
            merchant=body.get("merchant"),
            category=body.get("category"),
            subcategory=body.get("subcategory"),
            account_id=body.get("account_id"),
            payment_from_id=body.get("payment_from_id"),
        )

        if repayment.payment_from_id and not repayment.pending:
            account = repayment.update_account()
            if account:
                account = account.as_dict()

        return success_result({"repayment": repayment.as_dict(), "account": account})

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
            "pending",
            "merchant",
            "category",
            "subcategory",
            "account_id",
            "payment_from_id",
            "recurring_id",
            "description",
        ]:
            setattr(repayment, attr, request.json.get(attr))

        repayment.last_update = datetime.now(timezone.utc)
        repayment.save()

        account = None
        liability_account = None
        if repayment.pending is False and prev_pending is True:
            # update payment account
            account = repayment.update_account()
            account = account.as_dict()

            # update liability_account principal
            liability_account = repayment.update_account_principal()
            liability_account = liability_account.as_dict()

        return success_result(
            {
                "repayment": repayment.as_dict(),
                "account": account,
                "liability_account": liability_account,
            }
        )

    if request.method == "DELETE":
        Repayment.get_(user_id=user_id, repayment_id=repayment_id).delete()
        return success_result(f"{repayment_id} deleted")

    return failure_result()
