from datetime import datetime
from uuid import uuid4

from services.dynamo.models.networth import Networth


def create(
    user_id: str,
    _date: datetime,
    year: int,
    month: int,
    assets: float,
    debts: list,
) -> Networth:
    networth = Networth(
        user_id=user_id,
        networth_id=f"networth:{uuid4()}",
        date=_date,
        year=year,
        month=month,
        assets=assets,
        debts=debts,
    )
    networth.save()
    return networth


def get(year: int = None, month: int = None, user_id: str = None) -> Networth:
    if year and month and user_id:

        try:
            return next(
                Networth.query(
                    user_id,
                    Networth.networth_id.startswith("networth"),
                    (Networth.year == year) & (Networth.month == month),
                )
            )
        except StopIteration:
            return None

    if user_id:
        return list(Networth.query(user_id))

    return list(Networth.scan())
