# pylint: disable=too-many-arguments, arguments-renamed
"""Asset pynamodb model"""

import os
from typing import Optional
from uuid import uuid4
from datetime import datetime, timezone
from pynamodb.attributes import (
    BooleanAttribute,
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)
from .base import BaseModel


TYPE = "asset"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Asset(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    asset_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    account_id = UnicodeAttribute()
    name = UnicodeAttribute()
    value = NumberAttribute()
    category = UnicodeAttribute(default="")
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)
    can_deposit_to = BooleanAttribute(default=False)
    can_pay_from = BooleanAttribute(default=False)
    vendor = UnicodeAttribute(null=True)  # remove
    last_update = UTCDateTimeAttribute(default=datetime.now(timezone.utc))

    def __repr__(self):
        return f"Asset<{self.user_id}, {self.name}, {self.value}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        account_id: str,
        name: str,
        value: float,
        category: str,
        shares: float,
        price: float,
        can_deposit_to: bool = False,
        can_pay_from: bool = False,
    ):
        asset = cls(
            user_id=user_id,
            asset_id=f"asset:{uuid4()}",
            account_id=account_id,
            name=name,
            value=value,
            category=category,
            shares=shares,
            price=price,
            can_deposit_to=can_deposit_to,
            can_pay_from=can_pay_from,
            last_update=datetime.now(timezone.utc),
        )
        asset.save()
        return asset

    @classmethod
    def update_(cls, user_id: str, asset_id: str, **kwargs) -> "Asset":
        actions = []
        asset = cls.get(user_id, asset_id)

        print(f"kwargs: {kwargs}")
        asset.update(
            actions=[*actions, cls.last_update.set(datetime.now(timezone.utc))]
        )
        return asset

    @classmethod
    def get_(cls, user_id: str, asset_id: str) -> "Asset":
        return super().get_(user_id, asset_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, asset_id: Optional[str] = None
    ) -> list["Asset"]:
        return super().list(user_id, asset_id)
