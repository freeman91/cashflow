"""Bill pynamodb model"""

import os
from datetime import datetime, timezone
from pynamodb.attributes import (
    NumberAttribute,
    ListAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)
from .base import BaseModel

TYPE = "bill"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Bill(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    bill_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    amount = NumberAttribute()
    category = UnicodeAttribute()
    vendor = UnicodeAttribute()
    day = NumberAttribute()
    months = ListAttribute()
    debt_id = UnicodeAttribute(null=True)
    last_update = UTCDateTimeAttribute(default=datetime.now(timezone.utc))

    def __repr__(self):
        return f"Bill<{self.user_id}, {self.name}, {self.amount}>"
