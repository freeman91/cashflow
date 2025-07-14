"""Audits controller"""

from ...dynamo import Audit
from .__util__ import success_result, failure_result, handle_exception

from flask import Blueprint, request

audits = Blueprint("audits", __name__)


@audits.route("/audits/<user_id>", methods=["POST", "GET"])
@handle_exception
def _audits(user_id: str):

    if request.method == "GET":
        audits_ = Audit.scan()
        return success_result([audit.as_dict() for audit in audits_])

    return failure_result()
