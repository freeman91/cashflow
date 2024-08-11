"""Expenses controller"""

from datetime import datetime, timedelta
from flask import Blueprint, request

from services.dynamo import Expense
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

expenses = Blueprint("expenses", __name__)


@handle_exception
@expenses.route("/expenses/<user_id>", methods=["POST", "GET"])
def _expenses(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")

        expense = Expense.create(
            user_id=user_id,
            _date=_date,
            amount=float(body.get("amount")),
            vendor=body.get("vendor"),
            category=body.get("category"),
            subcategory=body.get("subcategory"),
            pending=body.get("pending"),
            bill_id=body.get("bill_id"),
            description=body.get("description"),
        )
        return success_result(expense.as_dict())

    if request.method == "GET":
        start = datetime.strptime(request.args.get("start"), "%Y-%m-%d")
        end = datetime.strptime(request.args.get("end"), "%Y-%m-%d") + timedelta(
            hours=24
        )
        return success_result(
            [
                expense.as_dict()
                for expense in Expense.search(user_id=user_id, start=start, end=end)
            ]
        )

    return failure_result()


@handle_exception
@expenses.route("/expenses/<user_id>/<expense_id>", methods=["GET", "PUT", "DELETE"])
def _expense(user_id: str, expense_id: str):
    if request.method == "GET":
        return success_result(
            Expense.get_(user_id=user_id, expense_id=expense_id).as_dict()
        )

    if request.method == "PUT":
        expense = Expense.get_(user_id=user_id, expense_id=expense_id)
        expense.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")

        expense.amount = float(request.json.get("amount"))

        for attr in [
            "vendor",
            "category",
            "subcategory",
            "pending",
            "bill_id",
            "description",
        ]:
            setattr(expense, attr, request.json.get(attr))

        expense.save()
        return success_result(expense.as_dict())

    if request.method == "DELETE":
        Expense.get_(user_id=user_id, expense_id=expense_id).delete()
        return success_result(f"{expense_id} deleted")

    return failure_result()
