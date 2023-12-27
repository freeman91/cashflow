from datetime import datetime, timezone
from uuid import uuid4

from services.dynamo.models.bill import Bill


def create(
    user_id: str,
    name: str,
    amount: float,
    category: str,
    vendor: str,
    day: str,
    months: list,
    debt_id: str,
) -> Bill:
    bill = Bill(
        user_id=user_id,
        bill_id=f"bill:{uuid4()}",
        name=name,
        amount=amount,
        category=category,
        vendor=vendor,
        day=day,
        months=months,
        debt_id=debt_id,
        last_update=datetime.now(timezone.utc),
    )
    bill.save()
    return bill


def get(user_id: str = None, bill_id: str = None) -> Bill:
    if user_id and bill_id:
        return Bill.get(user_id, bill_id)

    if user_id:
        return list(Bill.query(user_id))

    return list(Bill.scan())


def update(user_id: str, bill_id: str, **kwargs) -> Bill:
    actions = []
    bill = Bill.get(user_id, bill_id)

    print(f"kwargs: {kwargs}")

    bill.update(actions=[*actions, Bill.last_update.set(datetime.now(timezone.utc))])

    return bill
