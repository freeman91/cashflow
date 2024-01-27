from datetime import datetime
from uuid import uuid4

from services.dynamo.models.repayment import Repayment


def create(
    user_id: str,
    _date: datetime,
    principal: float,
    interest: float,
    lender: str,
    category: str,
    subcategory: str,
    debt_id: str,
    escrow: float = None,
    bill_id: str = None,
    pending: bool = False,
) -> Repayment:
    repayment = Repayment(
        user_id=user_id,
        repayment_id=f"repayment:{uuid4()}",
        date=_date,
        principal=principal,
        interest=interest,
        escrow=escrow,
        lender=lender,
        category=category,
        subcategory=subcategory,
        debt_id=debt_id,
        bill_id=bill_id,
        pending=pending,
    )
    repayment.save()
    return repayment


def get(user_id: str = None, repayment_id: str = None) -> Repayment:
    if user_id and repayment_id:
        return Repayment.get(user_id, repayment_id)

    if user_id:
        return list(Repayment.query(user_id))

    return list(Repayment.scan())


def search(user_id: str, start: datetime, end: datetime):
    return list(
        Repayment.query(
            user_id,
            Repayment.repayment_id.startswith("repayment"),
            filter_condition=Repayment.date.between(start, end),
        )
    )
