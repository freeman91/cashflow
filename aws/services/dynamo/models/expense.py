"""Expense pynamodb model"""

import os
from pynamodb.attributes import (
    BooleanAttribute,
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from .base import BaseModel

TYPE = "expense"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Expense(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    expense_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    vendor = UnicodeAttribute(null=True)
    category = UnicodeAttribute(default="")
    pending = BooleanAttribute(default=False)
    bill_id = UnicodeAttribute(null=True)
    asset_id = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Expense<{self.user_id}, {self.date}, {self.vendor}, {self.amount}>"
