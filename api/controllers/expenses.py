from flask import request, Blueprint

from api.db.expenses import Expenses
from api.controllers.__util__ import serialize_dict

expenses = Blueprint("expenses", __name__)


@expenses.route("/expenses", methods=["POST"])
def _create_expense():
    return {
        "expense": serialize_dict(
            Expenses.get(Expenses.create(request.json).inserted_id)
        )
    }, 200


@expenses.route("/expenses/<string:id>", methods=["GET", "PUT", "DELETE"])
def _expenses(id: str):
    if request.method == "GET":
        # if does not exist send back 400 error
        return {"expense": serialize_dict(Expenses.get(id))}, 200

    if request.method == "PUT":
        expense = request.json
        Expenses.update(expense)
        return {"expense": serialize_dict(Expenses.get(expense["_id"]))}, 200

    if request.method == "DELETE":
        Expenses.delete(id)
        return "Expense deleted", 200


@expenses.route("/expenses/range/<start>/<end>", methods=["GET"])
def _expenses_in_range(start: str, end: str):
    if not (start.isnumeric() and end.isnumeric()):
        return {"result": "Invalid range"}, 400

    return {
        "expenses": [
            serialize_dict(expense)
            for expense in Expenses.in_range(int(start), int(end))
        ]
    }, 200
