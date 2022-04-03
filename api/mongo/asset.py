# pylint: disable= missing-function-docstring

"""monog.asset submodule"""

from datetime import datetime
from typing import List, Union

from pydash import get as _get

from api.mongo.models.Asset import Asset
from .connection import database
from .models.common import PydanticObjectId


def get(_id: str = None) -> Union[Asset, List[Asset]]:
    """
    GET

    mongo.asset.get(): returns all assets
    mongo.asset.get("<asset_id>"): returns a single asset or None if it doesn't exist
    """

    if _id:
        asset = database.assets.find_one({"_id": PydanticObjectId(_id)})
        return Asset(**asset)

    return [Asset(**asset) for asset in database.assets.find()]


def search(start: datetime, stop: datetime) -> List[Asset]:
    """
    SEARCH

    mongo.asset.search(<start>, <stop>): returns all assets in the given range
    """
    return [
        Asset(**asset)
        for asset in database.assets.find(
            {
                "date": {
                    "$gt": start,
                    "$lt": stop,
                }
            }
        )
    ]


def create(asset: dict) -> Asset:
    """
    CREATE

    mongo.asset.create(<asset>): inserts new asset in the db
        - name: str
        - value: float
        - type: str
        - shares: Optional[float]
        - price: Optional[float]
        - vendor: Optional[str]
        - debt: Optional[PydanticObjectId]
        - invested: Optional[float]
        - description: Optional[str]
    """
    return get(Asset(**asset).create())


def update(asset: dict) -> Asset:
    """
    UPDATE

    mongo.asset.update(<asset>): updates an existing asset in the db
        - name: str
        - value: float
        - type: str
        - shares: Optional[float]
        - price: Optional[float]
        - vendor: Optional[str]
        - debt: Optional[PydanticObjectId]
        - invested: Optional[float]
        - description: Optional[str]
    """

    asset_obj = get(_get(asset, "id"))
    asset_obj.name = _get(asset, "name")
    asset_obj.value = float(_get(asset, "value"))
    asset_obj.type = _get(asset, "type")
    asset_obj.shares = float(_get(asset, "shares"))
    asset_obj.price = float(_get(asset, "price"))
    asset_obj.vendor = _get(asset, "vendor")
    asset_obj.debt = _get(asset, "debt")
    asset_obj.invested = float(_get(asset, "invested"))
    asset_obj.description = _get(asset, "description")

    asset_obj.save()
    return asset_obj


def delete(_id: str):
    """
    DELETE

    mongo.asset.delete<asset_id>): deleted an asset in the db if it exists
    """
    return database.assets.delete_one({"_id": PydanticObjectId(_id)})
