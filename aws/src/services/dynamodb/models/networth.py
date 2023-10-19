"""Networth pynamodb model"""

import os
from pynamodb.models import Model
from pynamodb.attributes import (
    ListAttribute,
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

TYPE = "networth"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Networth(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

    user_id = UnicodeAttribute(hash_key=True)
    networth_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    year = NumberAttribute()
    month = NumberAttribute()

    assets = ListAttribute()
    liabilities = ListAttribute()

    def __repr__(self):
        return f"Income<{self.user_id}, {self.year}, {self.month}>"
