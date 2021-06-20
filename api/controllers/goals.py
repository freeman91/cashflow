from flask import request, Blueprint

from api.db.goals import Goals
from api.controllers.__util__ import serialize_dict, success_result, failure_result

goals = Blueprint("goals", __name__)


@goals.route("/goals", methods=["POST"])
def _create_goal():
    try:
        # check if now is before first of month in goal payload
        return success_result(Goals.get(Goals.create(request.json).inserted_id))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@goals.route("/goals/<string:id>", methods=["GET", "PUT", "DELETE"])
def _goals(id: str):
    try:
        if request.method == "GET":
            # if does not exist send back 400 error
            return success_result(Goals.get(id))

        if request.method == "PUT":
            # check if now is before first of month in goal payload
            goal = request.json
            Goals.update(goal)
            return success_result(Goals.get(goal["_id"]))

        if request.method == "DELETE":
            Goals.delete(id)
            return "Expense deleted", 200
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@goals.route("/goals/range/<start>/<end>", methods=["GET"])
def _goals_in_range(start: str, end: str):
    try:
        if not (start.isnumeric() and end.isnumeric()):
            return {"result": "Invalid range"}, 400

        success_result(
            [serialize_dict(goal) for goal in Goals.in_range(int(start), int(end))]
        )
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
