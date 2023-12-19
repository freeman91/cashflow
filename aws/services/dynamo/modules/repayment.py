from datetime import datetime
from uuid import uuid4

from services.dynamo.models.repayment import Repayment


def create(
    user_id: str,
    _date: datetime,
    amount: float,
    principal: float,
    interest: float,
    lender: str,
    debt_id: str,
    bill_id: str = None,
    description: str = None,
) -> Repayment:
    repayment = Repayment(
        user_id=user_id,
        repayment_id=f"repayment:{uuid4()}",
        date=_date,
        amount=amount,
        principal=principal,
        interest=interest,
        lender=lender,
        debt_id=debt_id,
        bill_id=bill_id,
        description=description,
    )
    repayment.save()
    return repayment


def get(user_id: str = None, repayment_id: str = None) -> Repayment:
    if user_id and repayment_id:
        return Repayment.get(user_id, repayment_id)

    if user_id:
        return list(Repayment.query(user_id))

    return list(Repayment.scan())
