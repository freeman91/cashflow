from datetime import datetime, timezone
from uuid import uuid4

from services.dynamo.models.asset import Asset


def create(
    user_id: str,
    account_id: str,
    name: str,
    value: float,
    category: str,
    shares: float,
    price: float,
) -> Asset:
    asset = Asset(
        user_id=user_id,
        asset_id=f"asset:{uuid4()}",
        account_id=account_id,
        name=name,
        value=value,
        category=category,
        shares=shares,
        price=price,
        last_update=datetime.now(timezone.utc),
    )
    asset.save()
    return asset


def get(user_id: str = None, asset_id: str = None) -> Asset:
    if user_id and asset_id:
        return Asset.get(user_id, asset_id)

    if user_id:
        return list(Asset.query(user_id))

    return list(Asset.scan())


def update(user_id: str, asset_id: str, **kwargs) -> Asset:
    actions = []
    asset = Asset.get(user_id, asset_id)

    print(f"kwargs: {kwargs}")

    asset.update(actions=[*actions, Asset.last_update.set(datetime.now(timezone.utc))])

    return asset
