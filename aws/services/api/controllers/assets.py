# pylint: disable=import-error, broad-except
"""Assets controller"""

from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

assets = Blueprint("assets", __name__)


@handle_exception
@assets.route("/assets/<user_id>", methods=["POST", "GET"])
def _assets(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [asset.as_dict() for asset in dynamo.asset.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@assets.route("/assets/<user_id>/<asset_id>", methods=["GET", "PUT", "DELETE"])
def _asset(user_id: str, asset_id: str):
    print(f"user_id: {user_id}")
    print(f"asset_id: {asset_id}")
    print(f"request.json: {request.json}")
    if request.method == "GET":
        # return success_result()
        pass

    if request.method == "PUT":
        # return success_result()
        pass

    if request.method == "DELETE":
        # return success_result()
        pass

    return failure_result()
