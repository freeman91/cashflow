from datetime import datetime, timedelta
from flask import Blueprint, request

from services.dynamo import Paycheck
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

paychecks = Blueprint("paychecks", __name__)


@handle_exception
@paychecks.route("/paycheck-templates/<user_id>", methods=["GET"])
def _paycheck_templates(user_id: str):
    if request.method == "GET":
        templates = list(
            Paycheck.query(
                user_id, Paycheck.paycheck_id.startswith("paycheck:template")
            )
        )
        return success_result([paycheck.as_dict() for paycheck in templates])
    return failure_result()


@handle_exception
@paychecks.route("/paychecks/<user_id>", methods=["POST", "GET"])
def _paychecks(user_id: str):
    if request.method == "POST":
        body = request.json
        paycheck = None
        asset = None

        if body.get("paycheck_id").startswith("paycheck:template"):
            paycheck = Paycheck.create_template(
                user_id=user_id,
                paycheck_id=body.get("paycheck_id"),
                employer=body.get("employer"),
                take_home=float(body.get("take_home")),
                taxes=float(body.get("taxes")),
                retirement_contribution=body.get("retirement"),
                benefits_contribution=body.get("benefits"),
                other_benefits=float(body.get("other")),
                other=float(body.get("other")),
                deposit_to_id=body.get("deposit_to_id"),
                description=body.get("description"),
            )

        else:
            _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
            paycheck = Paycheck.create(
                user_id=user_id,
                _date=_date,
                employer=body.get("employer"),
                take_home=float(body.get("take_home")),
                taxes=float(body.get("taxes")),
                retirement_contribution=body.get("retirement"),
                benefits_contribution=body.get("benefits"),
                other_benefits=float(body.get("other")),
                other=float(body.get("other")),
                deposit_to_id=body.get("deposit_to_id"),
                description=body.get("description"),
            )

            if paycheck.deposit_to_id:
                asset = paycheck.update_account()
                asset = asset.as_dict()

        return success_result({"paycheck": paycheck.as_dict(), "asset": asset})

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
        paycheck = Paycheck.get_(user_id=user_id, paycheck_id=paycheck_id)
        if not paycheck.paycheck_id.startswith("paycheck:template"):
            paycheck.date = datetime.strptime(
                request.json["date"][:19], "%Y-%m-%dT%H:%M:%S"
            )

        bodyRetirementContribution = request.json.get("retirement_contribution")
        if bodyRetirementContribution:
            setattr(
                paycheck.retirement_contribution,
                "account_id",
                bodyRetirementContribution.get("account_id"),
            )
            setattr(
                paycheck.retirement_contribution,
                "employee",
                float(bodyRetirementContribution.get("employee")),
            )
            setattr(
                paycheck.retirement_contribution,
                "employer",
                float(bodyRetirementContribution.get("employer")),
            )

        bodyBenefitsContribution = request.json.get("benefits_contribution")
        if bodyBenefitsContribution:
            setattr(
                paycheck.benefits_contribution,
                "account_id",
                bodyBenefitsContribution.get("account_id"),
            )
            setattr(
                paycheck.benefits_contribution,
                "employee",
                float(bodyBenefitsContribution.get("employee")),
            )
            setattr(
                paycheck.benefits_contribution,
                "employer",
                float(bodyBenefitsContribution.get("employer")),
            )

        paycheck.employer = request.json.get("employer")
        paycheck.take_home = float(request.json.get("take_home"))
        paycheck.taxes = float(request.json.get("taxes") or 0)

        paycheck.other_benefits = float(request.json.get("other_benefits") or 0)
        paycheck.other = float(request.json.get("other") or 0)
        paycheck.description = request.json.get("description")
        paycheck.deposit_to_id = request.json.get("deposit_to_id")

        paycheck.save()
        return success_result(paycheck.as_dict())

    if request.method == "DELETE":
        Paycheck.get_(user_id=user_id, paycheck_id=paycheck_id).delete()
        return success_result(f"{paycheck_id} deleted")

    return failure_result()
