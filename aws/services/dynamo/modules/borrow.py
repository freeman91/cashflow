from datetime import datetime
from uuid import uuid4

from services.dynamo.models.borrow import Borrow


def create(
    user_id: str, _date: datetime, debt_id: str, amount: float, lender: str
) -> Borrow:
    borrow = Borrow(
        user_id=user_id,
        borrow_id=f"borrow:{uuid4()}",
        date=_date,
        debt_id=debt_id,
        amount=amount,
        lender=lender,
    )
    borrow.save()
    return borrow


def get(user_id: str = None, borrow_id: str = None) -> Borrow:
    if user_id and borrow_id:
        return Borrow.get(user_id, borrow_id)

    if user_id:
        return list(Borrow.query(user_id))

    return list(Borrow.scan())

def search(user_id: str, start: datetime, end: datetime):
    return list(
        Borrow.query(
            user_id,
            Borrow.borrow_id.startswith("borrow"),
            filter_condition=Borrow.date.between(start, end),
        )
    )