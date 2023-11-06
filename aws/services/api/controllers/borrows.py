from flask import Blueprint, request

from services import dynamo
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

borrows = Blueprint("borrows", __name__)


@handle_exception
@borrows.route("/borrows/<user_id>", methods=["POST", "GET"])
def _borrows(user_id: str):
    print(f"request.json: {request.json}")
    if request.method == "POST":
        # return success_result()
        pass

    if request.method == "GET":
        return success_result(
            [borrow.as_dict() for borrow in dynamo.borrow.get(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@borrows.route("/borrows/<user_id>/<borrow_id>", methods=["GET", "PUT", "DELETE"])
def _borrow(user_id: str, borrow_id: str):
    print(f"user_id: {user_id}")
    print(f"borrow_id: {borrow_id}")
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
