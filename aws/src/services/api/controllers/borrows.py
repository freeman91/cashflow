"""Borrows controller"""

from datetime import datetime, timedelta, timezone
from flask import Blueprint, request

from ...dynamo import Borrow
from .__util__ import (
    failure_result,
    handle_exception,
    success_result,
    log_action,
)

borrows = Blueprint("borrows", __name__)


@borrows.route("/borrows/<user_id>", methods=["POST", "GET"])
@handle_exception
def _borrows(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        borrow = Borrow.create(
            user_id=user_id,
            _date=_date,
            amount=float(body.get("amount")),
            merchant=body.get("merchant"),
            account_id=body.get("account_id"),
        )
        log_action(user_id, f"Borrow created: {borrow.merchant}")
        return success_result(borrow.as_dict())

    if request.method == "GET":
        start = datetime.strptime(request.args.get("start"), "%Y-%m-%d")
        end = datetime.strptime(request.args.get("end"), "%Y-%m-%d") + timedelta(
            hours=24
        )
        return success_result(
            [
                borrow.as_dict()
                for borrow in Borrow.search(user_id=user_id, start=start, end=end)
            ]
        )

    return failure_result()


@borrows.route("/borrows/<user_id>/<borrow_id>", methods=["GET", "PUT", "DELETE"])
@handle_exception
def _borrow(user_id: str, borrow_id: str):
    if request.method == "GET":
        return success_result(
            Borrow.get_(user_id=user_id, borrow_id=borrow_id).as_dict()
        )

    if request.method == "PUT":
        borrow = Borrow.get_(user_id=user_id, borrow_id=borrow_id)
        borrow.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")
        borrow.amount = float(request.json.get("amount"))

        for attr in ["merchant", "pending", "account_id"]:
            setattr(borrow, attr, request.json.get(attr))

        borrow.last_update = datetime.now(timezone.utc)
        borrow.save()
        log_action(user_id, f"Borrow updated: {borrow.merchant}")
        return success_result(borrow.as_dict())

    if request.method == "DELETE":
        Borrow.get_(user_id=user_id, borrow_id=borrow_id).delete()
        log_action(user_id, f"Borrow deleted: {borrow_id}")
        return success_result(f"{borrow_id} deleted")

    return failure_result()
