from datetime import datetime, timedelta
from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

incomes = Blueprint("incomes", __name__)


@handle_exception
@incomes.route("/incomes/<user_id>", methods=["POST", "GET"])
def _incomes(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        income = dynamo.income.create(
            user_id=user_id,
            _date=_date,
            amount=float(body.get("amount")),
            source=body.get("source"),
            description=body.get("description"),
        )
        return success_result(income.as_dict())

    if request.method == "GET":
        start = datetime.strptime(request.args.get("start"), '%Y-%m-%d')
        end = datetime.strptime(request.args.get("end"), '%Y-%m-%d') + timedelta(hours=24)
        return success_result(
            [income.as_dict() for income in dynamo.income.search(user_id=user_id, start=start, end=end)]
        )
    return failure_result()


@handle_exception
@incomes.route("/incomes/<user_id>/<income_id>", methods=["GET", "PUT", "DELETE"])
def _income(user_id: str, income_id: str):
    if request.method == "GET":
        return success_result(
            dynamo.income.get(user_id=user_id, income_id=income_id).as_dict()
        )

    if request.method == "PUT":
        income = dynamo.income.get(user_id=user_id, income_id=income_id)
        income.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")
        income.amount = float(request.json.get("amount"))

        for attr in ["source", "description"]:
            setattr(income, attr, request.json.get(attr))

        income.save()
        return success_result(income.as_dict())

    if request.method == "DELETE":
        dynamo.income.get(user_id=user_id, income_id=income_id).delete()
        return success_result(f"{income_id} deleted")

    return failure_result()
