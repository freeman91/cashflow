from datetime import datetime
from flask import request, Blueprint

from api.db.goals import Goals
from api.controllers.__util__ import success_result, failure_result

goals = Blueprint("goals", __name__)


@goals.route("/goals", methods=["GET", "POST"])
def _goals():
    try:
        if request.method == "GET":
            return success_result(Goals.get_all())

        if request.method == "POST":
            payload = request.json

            date = datetime.strptime(payload.get("date"), "%d-%m-%Y")
            goal = {
                "category": "goal",
                "date": date,
                "month": date.month,
                "year": date.year,
                "values": payload.get("values"),
            }

            return success_result(Goals.get(Goals.create(goal).inserted_id))

    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@goals.route("/goals/<string:id>", methods=["GET", "PUT", "DELETE"])
def _goals_id(_id: str):
    try:
        if request.method == "GET":
            # if does not exist send back 400 error
            return success_result(Goals.get(_id))

        if request.method == "PUT":
            # check if now is before first of month in goal payload
            payload = request.json

            goal = Goals.get(payload.get("_id"))
            goal["values"] = payload.get("values")

            Goals.update(goal)
            return success_result(Goals.get(goal["_id"]))

        if request.method == "DELETE":
            Goals.delete(_id)
            return "Expense deleted", 200

        return
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@goals.route("/goals/range/<start>/<end>", methods=["GET"])
def _goals_in_range(start: str, end: str):
    try:
        if not (start.isnumeric() and end.isnumeric()):
            return {"result": "Invalid range"}, 400

        return success_result(Goals.in_range(int(start), int(end)))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
