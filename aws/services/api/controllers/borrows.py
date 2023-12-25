from datetime import datetime, timedelta
from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

borrows = Blueprint("borrows", __name__)


@handle_exception
@borrows.route("/borrows/<user_id>", methods=["POST", "GET"])
def _borrows(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        borrow = dynamo.borrow.create(
            user_id=user_id,
            _date=_date,
            amount=float(body.get("amount")),
            lender=body.get("lender"),
            debt_id=body.get("debt_id"),
        )
        return success_result(borrow.as_dict())

    if request.method == "GET":
        start = datetime.strptime(request.args.get("start"), '%Y-%m-%d')
        end = datetime.strptime(request.args.get("end"), '%Y-%m-%d') + timedelta(hours=24)
        return success_result(
            [borrow.as_dict() for borrow in dynamo.borrow.search(user_id=user_id, start=start, end=end)]
        )
    return failure_result()


@handle_exception
@borrows.route("/borrows/<user_id>/<borrow_id>", methods=["GET", "PUT", "DELETE"])
def _borrow(user_id: str, borrow_id: str):
    if request.method == "GET":
        return success_result(
            dynamo.borrow.get(user_id=user_id, borrow_id=borrow_id).as_dict()
        )

    if request.method == "PUT":
        borrow = dynamo.borrow.get(user_id=user_id, borrow_id=borrow_id)
        borrow.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")
        borrow.amount = float(request.json.get("amount"))

        for attr in [
            "lender",
            "pending",
            "debt_id",
        ]:
            setattr(borrow, attr, request.json.get(attr))

        borrow.save()
        return success_result(borrow.as_dict())

    if request.method == "DELETE":
        dynamo.borrow.get(user_id=user_id, borrow_id=borrow_id).delete()
        return success_result(f"{borrow_id} deleted")

    return failure_result()
