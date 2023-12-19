"""Borrow pynamodb model"""

import os
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "borrow"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Borrow(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    borrow_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    debt_id = UnicodeAttribute()
    amount = NumberAttribute()
    lender = UnicodeAttribute()

    def __repr__(self):
        return f"Borrow<{self.user_id}, {self.debt_id}, {self.date}, {self.amount}>"
