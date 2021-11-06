from datetime import datetime, timedelta

from api.controllers.__util__ import failure_result, success_result
from api.db.expenses import Expenses
from flask import Blueprint, request

expenses = Blueprint("expenses", __name__)


@expenses.route("/expenses/recent", methods=["GET"])
def _get_recent_expenses():
    try:
        end = datetime.now() + timedelta(days=1)
        start = end - timedelta(days=8)
        return success_result(
            {"expenses": Expenses.in_range(start.timestamp(), end.timestamp())}
        )
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@expenses.route("/expenses", methods=["POST"])
def _create_expense():
    try:
        new_expense = request.json
        if not hasattr(new_expense, "asset"):
            new_expense["asset"] = ""
        if not hasattr(new_expense, "debt"):
            new_expense["debt"] = ""
        new_expense["date"] = datetime.strptime(
            new_expense["date"], "%m-%d-%Y"
        ).replace(hour=12)
        new_expense["amount"] = float(new_expense["amount"])
        return success_result(Expenses.get(Expenses.create(new_expense).inserted_id))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@expenses.route("/expenses/<string:id>", methods=["GET", "PUT", "DELETE"])
def _expenses(id: str):
    try:

        if request.method == "GET":
            return success_result(Expenses.get(id))

        elif request.method == "PUT":
            expense = request.json
            expense["amount"] = float(expense["amount"])
            expense["date"] = datetime.strptime(expense["date"], "%m-%d-%Y").replace(
                hour=12
            )
            Expenses.update(expense)
            return success_result(Expenses.get(expense["_id"]))

        elif request.method == "DELETE":
            Expenses.delete(id)
            return "Expense deleted", 200

        else:
            return failure_result("Bad Request")
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@expenses.route("/expenses/range/<start>/<end>", methods=["GET"])
def _expenses_in_range(start: str, end: str):
    try:
        if not (start.isnumeric() and end.isnumeric()):
            return {"result": "Invalid range"}, 400

        return success_result(Expenses.in_range(int(start), int(end)))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
