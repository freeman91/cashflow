from datetime import datetime
from uuid import uuid4

from services.dynamo.models.sale import Sale


def create(
    user_id: str,
    _date: datetime,
    amount: float,
    asset_id: str,
    shares: float,
    price: float,
    purchaser: str,
    description: str = None,
) -> Sale:
    sale = Sale(
        user_id=user_id,
        sale_id=f"sale:{uuid4()}",
        date=_date,
        amount=amount,
        purchaser=purchaser,
        asset_id=asset_id,
        shares=shares,
        price=price,
        description=description,
    )
    sale.save()
    return sale


def get(user_id: str = None, sale_id: str = None) -> Sale:
    if user_id and sale_id:
        return Sale.get(user_id, sale_id)

    if user_id:
        return list(Sale.query(user_id))

    return list(Sale.scan())
