# pylint: disable=too-many-arguments, arguments-renamed
"""Sale pynamodb model"""

import os
from datetime import datetime
from typing import Optional
from uuid import uuid4
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from services import dynamo
from .base import BaseModel

TYPE = "sale"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Sale(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    sale_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    vendor = UnicodeAttribute()
    asset_id = UnicodeAttribute(null=True)
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)
    fee = NumberAttribute(null=True)
    deposit_to_id = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Sale<{self.user_id}, {self.asset_id}, {self.date}, {self.amount}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        amount: float,
        asset_id: str,
        shares: float,
        price: float,
        vendor: str,
        fee: float,
        deposit_to_id: str,
    ) -> "Sale":
        sale = cls(
            user_id=user_id,
            sale_id=f"sale:{uuid4()}",
            date=_date,
            amount=amount,
            vendor=vendor,
            asset_id=asset_id,
            shares=shares,
            price=price,
            fee=fee,
            deposit_to_id=deposit_to_id,
        )
        sale.save()
        return sale

    @classmethod
    def get_(cls, user_id: str, sale_id: str) -> "Sale":
        return super().get_(user_id, sale_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, sale_id: Optional[str] = None
    ) -> list["Sale"]:
        return super().list(user_id, sale_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(
            cls.query(
                user_id,
                cls.sale_id.startswith("sale"),
                filter_condition=cls.date.between(start, end),
            )
        )

    def withdraw(self) -> dynamo.Asset:
        asset = None
        if self.asset_id.startswith("asset"):
            asset = dynamo.Asset.get_(self.user_id, self.asset_id)
            asset.shares -= self.shares
            asset.value = asset.shares * self.price
            asset.save()

        return asset

    def deposit(self) -> dynamo.Asset:
        asset = None
        if self.deposit_to_id.startswith("asset"):
            asset = dynamo.Asset.get_(self.user_id, self.deposit_to_id)
            asset.value += self.amount
            asset.save()

        asset.save()
        return asset
