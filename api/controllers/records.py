from datetime import datetime, timedelta
from flask import request, Blueprint

from api.db.expenses import Expenses
from api.db.incomes import Incomes
from api.db.hours import Hours
from api.db.assets import Assets
from api.db.debts import Debts
from api.db.goals import Goals

from api.controllers.__util__ import success_result, failure_result

records = Blueprint("records", __name__)


@records.route("/records/recent", methods=["GET"])
def _get_recent_records():
    try:
        end = datetime.now() + timedelta(days=1)
        start = end - timedelta(days=8)

        return success_result(
            {
                "expenses": Expenses.in_range(start.timestamp(), end.timestamp()),
                "incomes": Incomes.in_range(start.timestamp(), end.timestamp()),
                "hours": Hours.in_range(start.timestamp(), end.timestamp()),
                "goals": Goals.in_range(start.timestamp(), end.timestamp()),
                "assets": Assets.get_all(),
                "debts": Debts.get_all(),
            }
        )
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")
