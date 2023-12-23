from datetime import datetime, timezone
from uuid import uuid4

from services.dynamo.models.debt import Debt


def create(
    user_id: str,
    account_id: str,
    name: str,
    value: float,
    category: str,
    interest_rate: float = None,
) -> Debt:
    debt = Debt(
        user_id=user_id,
        debt_id=f"debt:{uuid4()}",
        account_id=account_id,
        name=name,
        value=value,
        category=category,
        interest_rate=interest_rate,
        last_update=datetime.now(timezone.utc),
    )
    debt.save()
    return debt


def get(user_id: str = None, debt_id: str = None) -> Debt:
    if user_id and debt_id:
        return Debt.get(user_id, debt_id)

    if user_id:
        return list(Debt.query(user_id))

    return list(Debt.scan())


def update(user_id: str, debt_id: str, **kwargs) -> Debt:
    actions = []
    debt = Debt.get(user_id, debt_id)

    print(f"kwargs: {kwargs}")

    debt.update(actions=[*actions, Debt.last_update.set(datetime.now(timezone.utc))])

    return debt
