"""Budgets controller"""

from datetime import datetime, timezone
from flask import Blueprint, request
from ...dynamo import Budget
from .__util__ import (
    failure_result,
    handle_exception,
    success_result,
    log_action,
)

budgets = Blueprint("budgets", __name__)


@budgets.route("/budgets/<user_id>", methods=["PUT", "GET"])
@handle_exception
def _budgets(user_id: str):
    if request.method == "PUT":
        budget = None
        body = request.json

        budget_id = body.get("budget_id")
        if budget_id:
            budget = Budget.get_(user_id, budget_id)
            # budget.update(actions=[Budget.categories.set(body.get("categories"))])
        else:
            budget = Budget.get_(user_id, body.get("month"))
            if budget:
                pass
                # budget.update(actions=[Budget.categories.set(body.get("categories"))])
            else:
                budget = Budget.create(
                    user_id=user_id,
                    month=f"{body.get('year')}-{body.get('month')}",
                    incomes=body.get("incomes"),
                    expenses=body.get("expenses"),
                    savings=body.get("savings"),
                )
        log_action(user_id, f"Budget created: {budget.month}")
        return success_result(budget.as_dict())

    if request.method == "GET":
        # TODO: get in range
        return success_result(
            [budget.as_dict() for budget in Budget.list(user_id=user_id)]
        )
    return failure_result()


@budgets.route("/budgets/<user_id>/<budget_id>", methods=["GET", "DELETE"])
@handle_exception
def _budget(user_id: str, budget_id: str):
    if request.method == "GET":
        print("GET")

    if request.method == "DELETE":
        print("DELETE")

    return failure_result()
