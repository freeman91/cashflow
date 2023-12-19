from datetime import datetime
from flask import Blueprint, request

from services import dynamo
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
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        paycheck = dynamo.paycheck.create(
            user_id=user_id,
            _date=_date,
            employer=body.get("employer"),
            take_home=float(body.get("take_home")),
            gross=float(body.get("gross")),
            taxes=float(body.get("taxes")),
            retirement=float(body.get("retirement")),
            other=float(body.get("other")),
        )
        return success_result(paycheck.as_dict())

    if request.method == "GET":
        return success_result(
            [paycheck.as_dict() for paycheck in dynamo.paycheck.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@paychecks.route("/paychecks/<user_id>/<paycheck_id>", methods=["GET", "PUT", "DELETE"])
def _paycheck(user_id: str, paycheck_id: str):
    if request.method == "GET":
        return success_result(
            dynamo.paycheck.get(user_id=user_id, paycheck_id=paycheck_id).as_dict()
        )

    if request.method == "PUT":
        paycheck = dynamo.paycheck.get(user_id=user_id, paycheck_id=paycheck_id)
        paycheck.date = datetime.strptime(
            request.json["date"][:19], "%Y-%m-%dT%H:%M:%S"
        )
        paycheck.take_home = float(request.json.get("take_home"))
        paycheck.gross = float(request.json.get("gross"))
        paycheck.taxes = float(request.json.get("taxes"))
        paycheck.retirement = float(request.json.get("retirement"))
        paycheck.other = float(request.json.get("other"))

        for attr in ["employer"]:
            setattr(paycheck, attr, request.json.get(attr))

        paycheck.save()
        return success_result(paycheck.as_dict())

    if request.method == "DELETE":
        dynamo.paycheck.get(user_id=user_id, paycheck_id=paycheck_id).delete()
        return success_result(f"{paycheck_id} deleted")

    return failure_result()
