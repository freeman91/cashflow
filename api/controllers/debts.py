from flask import request, Blueprint

from api.db.debts import Debts
from api.controllers.__util__ import success_result, failure_result

debts = Blueprint("debts", __name__)


@debts.route("/debts", methods=["POST", "GET"])
def _create_debt():

    try:
        if request.method == "GET":
            return success_result(Debts.get_all())
        if request.method == "POST":
            return success_result(Debts.get(Debts.create(request.json).inserted_id))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@debts.route("/debts/<string:id>", methods=["GET", "PUT", "DELETE"])
def _debts(id: str):
    try:
        if request.method == "GET":
            # if does not exist send back 400 error
            return success_result(Debts.get(id))

        if request.method == "PUT":
            debt = request.json
            Debts.update(debt)
            return success_result(Debts.get(debt["_id"]))

        if request.method == "DELETE":
            Debts.delete(id)
            return "Expense deleted", 200
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
