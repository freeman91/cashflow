from flask import request, Blueprint

from api.db.networths import Networths
from api.controllers.__util__ import success_result, failure_result

networths = Blueprint("networths", __name__)


@networths.route("/networths", methods=["POST"])
def _create_networth():
    try:
        return success_result(Networths.get(Networths.create(request.json).inserted_id))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@networths.route("/networths", methods=["GET"])
def _get_networths():
    try:
        if request.method == "GET":
            return success_result(Networths.get_all())

    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@networths.route("/networths/<string:id>", methods=["GET", "PUT", "DELETE"])
def _networths(id: str):
    try:
        if request.method == "GET":
            # if does not exist send back 400 error
            return success_result(Networths.get(id))

        if request.method == "PUT":
            networth = request.json
            Networths.update(networth)
            return success_result(Networths.get(networth["_id"]))

        if request.method == "DELETE":
            Networths.delete(id)
            return "Expense deleted", 200
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@networths.route("/networths/range/<start>/<end>", methods=["GET"])
def _networths_in_range(start: str, end: str):
    try:
        if not (start.isnumeric() and end.isnumeric()):
            return {"result": "Invalid range"}, 400

        return success_result(Networths.in_range(int(start), int(end)))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
