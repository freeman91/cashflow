from datetime import datetime
from uuid import uuid4

from services.dynamo.models.purchase import Purchase


def create(
    user_id: str,
    _date: datetime,
    asset_id: str,
    amount: float,
    vendor: str,
    shares: str = None,
    price: str = None,
) -> Purchase:
    purchase = Purchase(
        user_id=user_id,
        purchase_id=f"purchase:{uuid4()}",
        date=_date,
        asset_id=asset_id,
        amount=amount,
        vendor=vendor,
        shares=shares,
        price=price,
    )
    purchase.save()
    return purchase


def get(user_id: str = None, purchase_id: str = None) -> Purchase:
    if user_id and purchase_id:
        return Purchase.get(user_id, purchase_id)

    if user_id:
        return list(Purchase.query(user_id))

    return list(Purchase.scan())

def search(user_id: str, start: datetime, end: datetime):
    return list(
        Purchase.query(
            user_id,
            Purchase.purchase_id.startswith("purchase"),
            filter_condition=Purchase.date.between(start, end),
        )
    )