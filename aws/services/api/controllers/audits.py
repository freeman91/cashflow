from flask import Blueprint, request

from services.dynamo import Audit
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

audits = Blueprint("audits", __name__)


@audits.route("/audits/<user_id>", methods=["POST", "GET"])
@handle_exception
def _audits(user_id: str):

    if request.method == "GET":
        # start = request.args.get("user_id")
        # print("user_id", user_id)

        audits_ = Audit.scan()
        return success_result([audit.as_dict() for audit in audits_])

    return failure_result()
