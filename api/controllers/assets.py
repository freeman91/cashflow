from flask import request, Blueprint

from api.db.assets import Assets
from api.controllers.__util__ import success_result, failure_result

assets = Blueprint("assets", __name__)


@assets.route("/assets", methods=["POST", "GET"])
def _create_asset():

    try:
        if request.method == "GET":
            return success_result(Assets.get_all())
        if request.method == "POST":
            return success_result(Assets.get(Assets.create(request.json).inserted_id))
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@assets.route("/assets/<string:id>", methods=["GET", "PUT", "DELETE"])
def _assets(id: str):
    try:
        if request.method == "GET":
            # if does not exist send back 400 error
            return success_result(Assets.get(id))

        if request.method == "PUT":
            asset = request.json
            Assets.update(asset)
            return success_result(Assets.get(asset["_id"]))

        if request.method == "DELETE":
            Assets.delete(id)
            return "Expense deleted", 200
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
