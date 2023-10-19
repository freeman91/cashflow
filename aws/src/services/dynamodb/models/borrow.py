"""Borrow pynamodb model"""

import os
from pynamodb.models import Model
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

TYPE = "debt_acquire"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Borrow(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

    user_id = UnicodeAttribute(hash_key=True)
    borrow_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    debt_id = UnicodeAttribute()
    amount = NumberAttribute()
    creditor = UnicodeAttribute()

    def __repr__(self):
        return f"Borrow<{self.user_id}, {self.debt_id}, {self.date}, {self.amount}>"
