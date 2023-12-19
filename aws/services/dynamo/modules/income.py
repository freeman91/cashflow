from datetime import datetime
from uuid import uuid4

from services.dynamo.models.income import Income


def create(
    user_id: str,
    _date: datetime,
    amount: float,
    source: str,
    description: str = None,
) -> Income:
    income = Income(
        user_id=user_id,
        income_id=f"income:{uuid4()}",
        date=_date,
        amount=amount,
        source=source,
        description=description,
    )
    income.save()
    return income


def get(user_id: str = None, income_id: str = None) -> Income:
    if user_id and income_id:
        return Income.get(user_id, income_id)

    if user_id:
        return list(Income.query(user_id))

    return list(Income.scan())


def search(user_id: str, start: datetime, end: datetime):
    return list(
        Income.query(
            user_id,
            Income.income_id.startswith("income"),
            filter_condition=Income.date.between(start, end),
        )
    )
