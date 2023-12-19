from datetime import datetime
from uuid import uuid4

from services.dynamo.models.paycheck import Paycheck


def create(
    user_id: str,
    _date: datetime,
    employer: str,
    take_home: float,
    gross: float = None,
    taxes: float = None,
    retirement: float = None,
    other: float = None,
) -> Paycheck:
    paycheck = Paycheck(
        user_id=user_id,
        paycheck_id=f"paycheck:{uuid4()}",
        date=_date,
        employer=employer,
        take_home=take_home,
        gross=gross,
        taxes=taxes,
        retirement=retirement,
        other=other,
    )
    paycheck.save()
    return paycheck


def get(user_id: str = None, paycheck_id: str = None) -> Paycheck:
    if user_id and paycheck_id:
        return Paycheck.get(user_id, paycheck_id)

    if user_id:
        return list(Paycheck.query(user_id))

    return list(Paycheck.scan())
