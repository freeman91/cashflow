from datetime import datetime, timezone, timedelta
from flask import Blueprint, request

from services.dynamo import Income
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
    log_action,
)

incomes = Blueprint("incomes", __name__)


@incomes.route("/incomes/<user_id>", methods=["POST", "GET"])
@handle_exception
def _incomes(user_id: str):
    if request.method == "POST":
        account = None
        body = request.json
        _date = datetime.strptime(body["date"][:19], "%Y-%m-%dT%H:%M:%S")
        income = Income.create(
            user_id=user_id,
            _date=_date,
            pending=body.get("pending", True),
            amount=float(body.get("amount")),
            source=body.get("source"),
            category=body.get("category"),
            deposit_to_id=body.get("deposit_to_id"),
            recurring_id=body.get("recurring_id"),
            description=body.get("description"),
        )
        log_action(user_id, f"Income created: {income.source}")
        if income.deposit_to_id and not income.pending:
            account = income.update_account()
            if account:
                account = account.as_dict()

        return success_result({"income": income.as_dict(), "account": account})

    if request.method == "GET":
        start = datetime.strptime(request.args.get("start"), "%Y-%m-%d")
        end = datetime.strptime(request.args.get("end"), "%Y-%m-%d") + timedelta(
            hours=24
        )
        return success_result(
            [
                income.as_dict()
                for income in Income.search(user_id=user_id, start=start, end=end)
            ]
        )
    return failure_result()


@incomes.route("/incomes/<user_id>/<income_id>", methods=["GET", "PUT", "DELETE"])
@handle_exception
def _income(user_id: str, income_id: str):
    if request.method == "GET":
        return success_result(
            Income.get_(user_id=user_id, income_id=income_id).as_dict()
        )

    if request.method == "PUT":
        income = Income.get_(user_id=user_id, income_id=income_id)
        income.date = datetime.strptime(request.json["date"][:19], "%Y-%m-%dT%H:%M:%S")
        income.amount = float(request.json.get("amount"))
        prev_pending = income.pending
        account = None

        for attr in [
            "pending",
            "source",
            "category",
            "deposit_to_id",
            "recurring_id",
            "description",
        ]:
            setattr(income, attr, request.json.get(attr))

        income.last_update = datetime.now(timezone.utc)
        income.save()

        if income.pending is False and prev_pending is True:
            account = income.update_account()
            if account:
                account = account.as_dict()

        log_action(user_id, f"Income updated: {income.source}")
        return success_result({"income": income.as_dict(), "account": account})

    if request.method == "DELETE":
        Income.get_(user_id=user_id, income_id=income_id).delete()
        log_action(user_id, f"Income deleted: {income_id}")
        return success_result(f"{income_id} deleted")

    return failure_result()
