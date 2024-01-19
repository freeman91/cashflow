"""Debt pynamodb model"""

import os
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "debt"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Debt(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    debt_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    account_id = UnicodeAttribute()
    name = UnicodeAttribute()
    lender = UnicodeAttribute(null=True)
    amount = NumberAttribute()
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    interest_rate = NumberAttribute(null=True)
    last_update = UTCDateTimeAttribute()

    def __repr__(self):
        return f"Debt<{self.user_id}, {self.name}>"
