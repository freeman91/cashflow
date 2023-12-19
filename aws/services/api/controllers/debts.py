from flask import Blueprint, request

from services import dynamo
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
        debt = dynamo.debt.create(
            user_id=user_id,
            account_id=body.get("account_id"),
            name=body.get("name"),
            lender=body.get("lender"),
            value=float(body.get("value")),
            interest_rate=float(body.get("interest_rate")),
        )
        return success_result(debt.as_dict())

    if request.method == "GET":
        return success_result(
            [debt.as_dict() for debt in dynamo.debt.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@debts.route("/debts/<user_id>/<debt_id>", methods=["GET", "PUT", "DELETE"])
def _debt(user_id: str, debt_id: str):
    if request.method == "GET":
        return success_result(
            dynamo.debt.get(user_id=user_id, debt_id=debt_id).as_dict()
        )

    if request.method == "PUT":
        debt = dynamo.debt.get(user_id=user_id, debt_id=debt_id)
        debt.value = float(request.json.get("value"))
        debt.interest_rate = float(request.json.get("interest_rate"))

        for attr in [
            "account_id",
            "name",
            "lender",
        ]:
            setattr(debt, attr, request.json.get(attr))

        debt.save()
        return success_result(debt.as_dict())

    if request.method == "DELETE":
        dynamo.debt.get(user_id=user_id, debt_id=debt_id).delete()
        return success_result(f"{debt_id} deleted")

    return failure_result()
