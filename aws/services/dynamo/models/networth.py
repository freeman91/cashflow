"""Networth pynamodb model"""

import os
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
    name = UnicodeAttribute()
    value = NumberAttribute()
    category = UnicodeAttribute(null=True)
    vendor = UnicodeAttribute(null=True)


class DebtMap(MapAttribute):
    name = UnicodeAttribute()
    value = NumberAttribute()
    category = UnicodeAttribute(null=True)
    lender = UnicodeAttribute(null=True)


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
