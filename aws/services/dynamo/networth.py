# pylint: disable=too-many-arguments, arguments-renamed
"""Networth pynamodb model"""

import os
from datetime import datetime
from typing import List, Optional
from uuid import uuid4
from pynamodb.attributes import (
    ListAttribute,
    NumberAttribute,
    MapAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from .base import BaseModel

TYPE = "networth"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class AssetMap(MapAttribute):
    asset_id = UnicodeAttribute()
    name = UnicodeAttribute()
    value = NumberAttribute()
    category = UnicodeAttribute()
    account_id = UnicodeAttribute()


class DebtMap(MapAttribute):
    debt_id = UnicodeAttribute()
    name = UnicodeAttribute()
    value = NumberAttribute()
    category = UnicodeAttribute()
    account_id = UnicodeAttribute()


class Networth(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    networth_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    year = NumberAttribute()
    month = NumberAttribute()
    assets = ListAttribute(of=AssetMap)
    debts = ListAttribute(of=DebtMap)

    def __repr__(self):
        return f"Networth<{self.user_id}, {self.year}, {self.month}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        year: int,
        month: int,
        assets: float,
        debts: List,
    ) -> "Networth":
        networth = cls(
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

    @classmethod
    def get_(cls, user_id: str, networth_id: str) -> "Networth":
        return super().get_(user_id, networth_id)

    @classmethod
    def get_month(cls, user_id: str, year: int, month: int) -> "Networth":
        try:
            return next(
                cls.query(
                    user_id,
                    cls.networth_id.startswith("networth"),
                    (cls.year == year) & (cls.month == month),
                )
            )
        except StopIteration:
            return None

    @classmethod
    def list_year(cls, user_id: str, year: int) -> List["Networth"]:
        return cls.query(
            user_id, cls.networth_id.startswith("networth"), cls.year == year
        )

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, networth_id: Optional[str] = None
    ) -> list["Networth"]:
        return super().list(user_id, networth_id)
