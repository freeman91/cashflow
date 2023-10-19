# pylint: disable=import-error, broad-except
"""Debts controller"""

from datetime import datetime
from flask import Blueprint, request

from api import mongo
from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    set_last_update,
    success_result,
)

debts = Blueprint("debts", __name__)


@handle_exception
@debts.route("/debts", methods=["POST", "GET"])
def _debts():
    if request.method == "POST":
        return success_result(mongo.debt.create(set_last_update(request.json)))
    if request.method == "GET":
        return success_result(mongo.debt.get())
    return failure_result()


@handle_exception
@debts.route("/debts/<string:_id>", methods=["GET", "PUT", "DELETE"])
def _debts_id(_id: str):
    if request.method == "GET":
        return success_result(mongo.debt.get(_id))

    if request.method == "PUT":
        return success_result(mongo.debt.update(request.json))

    if request.method == "DELETE":
        return success_result(mongo.debt.delete(_id).acknowledged)

    return failure_result()


@handle_exception
@debts.route("/debts/<string:_id>/payment", methods=["PUT"])
def _debts_id_payment(_id: str):

    if request.method == "PUT":
        payload = request.json
        debt = mongo.debt.get(_id)

        payment_amount = float(payload.get("amount"))
        debt.value = debt.value - payment_amount
        debt.save()

        # generate expense
        return success_result(
            {
                "updated_debt": debt,
                "new_expense": mongo.expense.create(
                    {
                        "date": datetime.now(),
                        "amount": payment_amount,
                        "type": "debt",
                        "vendor": debt.vendor,
                        "debt": _id,
                        "description": f"debt payment for {debt.name}",
                    }
                ),
            }
        )

    return failure_result()
