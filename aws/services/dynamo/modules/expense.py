from datetime import datetime
from uuid import uuid4

from services.dynamo.models.expense import Expense


def create(
    user_id: str,
    _date: datetime,
    amount: float,
    vendor: str,
    category: str,
    pending: bool = False,
    bill_id: str = None,
    description: str = None,
) -> Expense:
    expense = Expense(
        user_id=user_id,
        expense_id=f"expense:{uuid4()}",
        date=_date,
        amount=amount,
        category=category,
        vendor=vendor,
        pending=pending,
        bill_id=bill_id,
        description=description,
    )
    expense.save()
    return expense


def get(user_id: str = None, expense_id: str = None) -> Expense:
    if user_id and expense_id:
        return Expense.get(user_id, expense_id)

    if user_id:
        return list(Expense.query(user_id))

    return list(Expense.scan())


def search(user_id: str, start: datetime, end: datetime):
    return list(
        Expense.query(
            user_id,
            Expense.expense_id.startswith("expense"),
            filter_condition=Expense.date.between(start, end),
        )
    )
