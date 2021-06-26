from flask import request, Blueprint

from api.db.expenses import Expenses
from api.controllers.__util__ import success_result, failure_result

expenses = Blueprint("expenses", __name__)


@expenses.route("/expenses", methods=["POST"])
def _create_expense():
    try:
        return success_result(Expenses.get(Expenses.create(request.json).inserted_id))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@expenses.route("/expenses/<string:id>", methods=["GET", "PUT", "DELETE"])
def _expenses(id: str):
    try:
        if request.method == "GET":
            return success_result(Expenses.get(id))

        if request.method == "PUT":
            expense = request.json
            Expenses.update(expense)
            return success_result(Expenses.get(expense["_id"]))

        if request.method == "DELETE":
            Expenses.delete(id)
            return "Expense deleted", 200
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@expenses.route("/expenses/range/<start>/<end>", methods=["GET"])
def _expenses_in_range(start: str, end: str):
    try:
        if not (start.isnumeric() and end.isnumeric()):
            return {"result": "Invalid range"}, 400

        success_result(Expenses.in_range(int(start), int(end)))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
