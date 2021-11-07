from datetime import datetime
from flask import request, Blueprint

from api.db.debts import Debts
from api.db.expenses import Expenses
from api.controllers.__util__ import success_result, failure_result

debts = Blueprint("debts", __name__)


@debts.route("/debts", methods=["POST", "GET"])
def _create_debt():

    try:
        if request.method == "GET":
            return success_result(Debts.get_all())
        if request.method == "POST":
            new_debt = create()
            print(f"new_debt2: {new_debt}")
            return success_result(new_debt)
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")

    return failure_result("Bad Request")


@debts.route("/debts/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _debts(_id: str):
    try:
        if request.method == "GET":
            # if does not exist send back 400 error
            return success_result(Debts.get(_id))

        if request.method == "PUT":
            debt = request.json
            debt["value"] = float(debt["value"])
            debt["last_update"] = datetime.now()
            Debts.update(debt)
            return success_result(Debts.get(debt["_id"]))

        if request.method == "DELETE":
            Debts.delete(id)
            return "Expense deleted", 200
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")

    return failure_result("Bad Request")


@debts.route("/debts/<string:_id>/payment", methods=["GET", "PUT", "DELETE"])
def _payment(_id: str):
    debt = Debts.get(_id)
    payload = request.json

    print(f"debt: {debt}")

    payment_amount = float(payload["amount"])
    debt["value"] = debt["value"] - payment_amount
    Debts.update(debt)

    # generate expense
    new_expense = {
        "date": datetime.now(),
        "amount": payment_amount,
        "type": "debt",
        "vendor": debt["vendor"],
        "debt": _id,
        "description": f"debt payment for {debt['name']}",
    }
    new_expense = Expenses.get(Expenses.create(new_expense).inserted_id)

    return success_result(Debts.get(debt["_id"]))


def create():
    new_debt = request.json
    new_debt["value"] = float(new_debt["value"])
    new_debt["last_update"] = datetime.now()

    return Debts.get(Debts.create(new_debt).inserted_id)
