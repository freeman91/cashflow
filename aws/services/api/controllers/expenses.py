"""Expenses controller"""

from datetime import datetime, timezone, timedelta
from flask import Blueprint, request

from services.dynamo import Expense
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
    log_action,
)

expenses = Blueprint("expenses", __name__)


@expenses.route("/expenses/<user_id>", methods=["POST", "GET"])
@handle_exception
def _expenses(user_id: str):
    if request.method == "POST":
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")

        expense = Expense.create(
            user_id=user_id,
            _date=_date,
            pending=body.get("pending"),
            amount=float(body.get("amount")),
            merchant=body.get("merchant"),
            category=body.get("category"),
            subcategory=body.get("subcategory"),
            payment_from_id=body.get("payment_from_id"),
            recurring_id=body.get("recurring_id"),
            description=body.get("description"),
        )
        log_action(user_id, f"Expense created: {expense.merchant}")
        account = None
        if not expense.pending and expense.payment_from_id:
            account = expense.update_account()
            if account:
                account = account.as_dict()

        return success_result({"expense": expense.as_dict(), "account": account})

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


@expenses.route("/expenses/<user_id>/<expense_id>", methods=["GET", "PUT", "DELETE"])
@handle_exception
def _expense(user_id: str, expense_id: str):
    if request.method == "GET":
        return success_result(
            Expense.get_(user_id=user_id, expense_id=expense_id).as_dict()
        )

    if request.method == "PUT":
        expense = Expense.get_(user_id=user_id, expense_id=expense_id)
        expense.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")

        prev_pending = expense.pending
        expense.amount = float(request.json.get("amount"))

        for attr in [
            "merchant",
            "category",
            "subcategory",
            "pending",
            "payment_from_id",
            "recurring_id",
            "description",
        ]:
            setattr(expense, attr, request.json.get(attr))

        expense.last_update = datetime.now(timezone.utc)
        expense.save()

        account = None
        if expense.pending is False and prev_pending is True:
            account = expense.update_account()
            if account:
                account = account.as_dict()

        log_action(user_id, f"Expense updated: {expense.merchant}")
        return success_result({"expense": expense.as_dict(), "account": account})

    if request.method == "DELETE":
        Expense.get_(user_id=user_id, expense_id=expense_id).delete()
        log_action(user_id, f"Expense deleted: {expense_id}")
        return success_result(f"{expense_id} deleted")

    return failure_result()
