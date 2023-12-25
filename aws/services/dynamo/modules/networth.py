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
    # if user_id and networth_id:
    #     return Networth.get(user_id, networth_id)

    if user_id:
        return list(Networth.query(user_id))

    return list(Networth.scan())
