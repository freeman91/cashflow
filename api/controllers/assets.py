# pylint: disable=import-error, broad-except
"""Assets controller"""

from datetime import datetime
from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    set_date,
    success_result,
)

assets = Blueprint("assets", __name__)


@handle_exception
@assets.route("/assets", methods=["POST", "GET"])
def _assets():
    if request.method == "POST":
        return success_result(mongo.asset.create(set_date(request.json)))
    if request.method == "GET":
        return success_result(mongo.asset.get())
    return failure_result()


@handle_exception
@assets.route("/assets/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _assets_id(_id: str):
    if request.method == "GET":
        return success_result(mongo.asset.get(_id))

    if request.method == "PUT":
        return success_result(mongo.asset.update(set_date(request.json)))

    if request.method == "DELETE":
        return success_result(mongo.asset.delete(_id).acknowledged)

    return failure_result()


@handle_exception
@assets.route("/assets/<string:_id>/<string:action>", methods=["PUT"])
def _assets_id_action(_id: str, action: str):

    if request.method == "PUT":
        if action == "sell":
            payload = request.json
            asset = mongo.asset.get(_id)

            return success_result(
                asset.sell(
                    payload.get("source"),
                    float(payload.get("shares")),
                    float(payload.get("price")),
                )
            )
        if action == "buy":
            payload = request.json
            asset = mongo.asset.get(_id)

            return success_result(
                asset.buy(
                    payload.get("vendor"),
                    float(payload.get("shares")),
                    float(payload.get("price")),
                )
            )

    return failure_result()


@handle_exception
@assets.route("/assets/range/<start>/<stop>", methods=["GET"])
def _fetch_assets_in_range(start: str, stop: str):

    if not (start.isnumeric() and stop.isnumeric()):
        return failure_result("Invalid range")

    return success_result(
        mongo.asset.search(
            datetime.fromtimestamp(int(start)), datetime.fromtimestamp(int(stop))
        )
    )
