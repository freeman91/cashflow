from flask import Blueprint, request

from services.dynamo import Debt
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

debts = Blueprint("debts", __name__)


@handle_exception
@debts.route("/debts/<user_id>", methods=["POST", "GET"])
def _debts(user_id: str):
    if request.method == "POST":
        body = request.json
        interest_rate = body.get("interest_rate")

        debt = Debt.create(
            user_id=user_id,
            account_id=body.get("account_id"),
            name=body.get("name"),
            amount=float(body.get("amount")),
            category=body.get("category"),
            subcategory=body.get("subcategory"),
            interest_rate=float(interest_rate) if interest_rate else None,
            can_pay_from=body.get("can_pay_from", False),
        )
        return success_result(debt.as_dict())

    if request.method == "GET":
        return success_result([debt.as_dict() for debt in Debt.list(user_id=user_id)])
    return failure_result()


@handle_exception
@debts.route("/debts/<user_id>/<debt_id>", methods=["GET", "PUT", "DELETE"])
def _debt(user_id: str, debt_id: str):
    if request.method == "GET":
        return success_result(Debt.get_(user_id=user_id, debt_id=debt_id).as_dict())

    if request.method == "PUT":
        debt = Debt.get_(user_id=user_id, debt_id=debt_id)
        debt.amount = float(request.json.get("amount"))

        interest_rate = request.json.get("interest_rate")
        debt.interest_rate = float(interest_rate) if interest_rate else None

        for attr in ["account_id", "name", "category", "subcategory", "can_pay_from"]:
            setattr(debt, attr, request.json.get(attr))

        debt.save()
        return success_result(debt.as_dict())

    if request.method == "DELETE":
        Debt.get_(user_id=user_id, debt_id=debt_id).delete()
        return success_result(f"{debt_id} deleted")

    return failure_result()
