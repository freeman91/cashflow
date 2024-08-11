# pylint: disable=too-many-arguments, arguments-renamed
"""Purchase pynamodb model"""

import os
from datetime import datetime
from typing import Optional
from uuid import uuid4
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "purchase"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Purchase(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    purchase_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    asset_id = UnicodeAttribute()
    amount = NumberAttribute()
    vendor = UnicodeAttribute(null=True)
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)

    def __repr__(self):
        return f"Purchase<{self.user_id}, {self.asset_id}, {self.date}, {self.amount}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        asset_id: str,
        amount: float,
        vendor: str,
        shares: str = None,
        price: str = None,
    ) -> "Purchase":
        purchase = cls(
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

    @classmethod
    def get_(cls, user_id: str, purchase_id: str) -> "Purchase":
        return super().get_(user_id, purchase_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, purchase_id: Optional[str] = None
    ) -> list["Purchase"]:
        return super().list(user_id, purchase_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(
            cls.query(
                user_id,
                cls.purchase_id.startswith("purchase"),
                filter_condition=cls.date.between(start, end),
            )
        )
