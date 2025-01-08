from flask import Blueprint, request

from services.dynamo import History
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

histories = Blueprint("histories", __name__)


@handle_exception
@histories.route("/histories/<user_id>", methods=["POST", "GET"])
def _histories(user_id: str):
    if request.method == "POST":
        pass

    if request.method == "GET":
        start = request.args.get("start")
        end = request.args.get("end")

        histories_ = History.user_index.query(
            user_id, History.month.between(start, end)
        )
        return success_result([history.as_dict() for history in histories_])

    return failure_result()


@handle_exception
@histories.route("/histories/<user_id>/<networth_id>", methods=["GET", "PUT", "DELETE"])
def _networth(user_id: str, networth_id: str):
    if request.method == "GET":
        pass

    if request.method == "PUT":
        pass

    if request.method == "DELETE":
        pass

    return failure_result()
