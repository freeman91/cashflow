from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

sales = Blueprint("sales", __name__)


@handle_exception
@sales.route("/sales/<user_id>", methods=["POST", "GET"])
def _sales(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [sale.as_dict() for sale in dynamo.sale.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@sales.route("/sales/<user_id>/<sale_id>", methods=["GET", "PUT", "DELETE"])
def _sale(user_id: str, sale_id: str):
    print(f"user_id: {user_id}")
    print(f"sale_id: {sale_id}")
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
