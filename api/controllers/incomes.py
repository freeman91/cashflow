from flask import request, Blueprint
from datetime import datetime, timedelta
from pydash import map_

from api.db.incomes import Incomes
from api.controllers.__util__ import success_result, failure_result

incomes = Blueprint("incomes", __name__)


@incomes.route("/incomes/recent", methods=["GET"])
def _get_recent_incomes():
    try:
        end = datetime.now() + timedelta(days=1)
        start = end - timedelta(days=20)
        return success_result(
            {"incomes": Incomes.in_range(start.timestamp(), end.timestamp())}
        )
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@incomes.route("/incomes", methods=["POST"])
def _create_income():
    try:
        new_income = request.json
        if not hasattr(new_income, "asset"):
            new_income["asset"] = ""
        new_income["date"] = round(
            datetime.strptime(new_income["date"], "%m-%d-%Y")
            .replace(hour=12)
            .timestamp()
        )
        new_income["amount"] = float(new_income["amount"])
        if new_income["type"] != "paycheck":
            new_income["deductions"] = {}
        for _type in new_income["deductions"]:
            new_income["deductions"][_type] = float(new_income["deductions"][_type])
        return success_result(Incomes.get(Incomes.create(new_income).inserted_id))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@incomes.route("/incomes/<string:id>", methods=["GET", "PUT", "DELETE"])
def _incomes(id: str):
    try:
        if request.method == "GET":
            # if does not exist send back 400 error
            return success_result(Incomes.get(id))

        if request.method == "PUT":
            income = request.json
            income["amount"] = float(income["amount"])
            income["date"] = datetime.strptime(income["date"], "%m-%d-%Y").replace(
                hour=12
            )
            for d in income["deductions"]:
                deduction = income["deductions"][d]
                if deduction == "":
                    income["deductions"][d] = float(0)
                else:
                    income["deductions"][d] = float(income["deductions"][d])

            Incomes.update(income)
            return success_result(Incomes.get(income["_id"]))

        if request.method == "DELETE":
            Incomes.delete(id)
            return "Expense deleted", 200
    except AssertionError as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@incomes.route("/incomes/range/<start>/<end>", methods=["GET"])
def _incomes_in_range(start: str, end: str):
    try:
        if not (start.isnumeric() and end.isnumeric()):
            return {"result": "Invalid range"}, 400

        return success_result(Incomes.in_range(int(start), int(end)))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
