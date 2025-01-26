from datetime import datetime, timezone, timedelta
from flask import Blueprint, request

from services.dynamo import Paycheck, ContributionItemAttribute
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

paychecks = Blueprint("paychecks", __name__)


@handle_exception
@paychecks.route("/paychecks/<user_id>", methods=["POST", "GET"])
def _paychecks(user_id: str):
    if request.method == "POST":
        body = request.json
        paycheck = None
        account = None

        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        paycheck = Paycheck.create(
            user_id=user_id,
            _date=_date,
            employer=body.get("employer"),
            take_home=float(body.get("take_home")),
            pending=body.get("pending"),
            taxes=float(body.get("taxes")),
            retirement_contribution=ContributionItemAttribute.parse(
                body.get("retirement_contribution")
            ),
            benefits_contribution=ContributionItemAttribute.parse(
                body.get("benefits_contribution")
            ),
            other_benefits=float(body.get("other_benefits")),
            other=float(body.get("other")),
            deposit_to_id=body.get("deposit_to_id"),
            recurring_id=body.get("recurring_id"),
            description=body.get("description"),
        )

        if paycheck.deposit_to_id and not paycheck.pending:
            account = paycheck.update_account()
            if account:
                account = account.as_dict()

        return success_result({"paycheck": paycheck.as_dict(), "account": account})

    if request.method == "GET":
        start = datetime.strptime(request.args.get("start"), "%Y-%m-%d")
        end = datetime.strptime(request.args.get("end"), "%Y-%m-%d") + timedelta(
            hours=24
        )
        return success_result(
            [
                paycheck.as_dict()
                for paycheck in Paycheck.search(user_id=user_id, start=start, end=end)
            ]
        )
    return failure_result()


@handle_exception
@paychecks.route("/paychecks/<user_id>/<paycheck_id>", methods=["GET", "PUT", "DELETE"])
def _paycheck(user_id: str, paycheck_id: str):
    if request.method == "GET":
        return success_result(
            Paycheck.get_(user_id=user_id, paycheck_id=paycheck_id).as_dict()
        )

    if request.method == "PUT":
        account = None
        paycheck = Paycheck.get_(user_id=user_id, paycheck_id=paycheck_id)
        paycheck.date = datetime.strptime(
            request.json["date"][:19], "%Y-%m-%dT%H:%M:%S"
        )
        prev_pending = paycheck.pending

        paycheck.take_home = float(request.json.get("take_home"))
        paycheck.taxes = float(request.json.get("taxes") or 0)
        paycheck.other_benefits = float(request.json.get("other_benefits") or 0)
        paycheck.other = float(request.json.get("other") or 0)

        paycheck.retirement_contribution = ContributionItemAttribute.parse(
            request.json.get("retirement_contribution")
        )
        paycheck.benefits_contribution = ContributionItemAttribute.parse(
            request.json.get("benefits_contribution")
        )

        for attr in [
            "employer",
            "pending",
            "deposit_to_id",
            "recurring_id",
            "description",
        ]:
            setattr(paycheck, attr, request.json.get(attr))

        paycheck.last_update = datetime.now(timezone.utc)
        paycheck.save()

        if paycheck.pending is False and prev_pending is True:
            account = paycheck.update_account()
            if account:
                account = account.as_dict()

        return success_result({"paycheck": paycheck.as_dict(), "account": account})

    if request.method == "DELETE":
        Paycheck.get_(user_id=user_id, paycheck_id=paycheck_id).delete()
        return success_result(f"{paycheck_id} deleted")

    return failure_result()
