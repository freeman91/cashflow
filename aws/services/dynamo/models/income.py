"""Income pynamodb model"""

import os
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "income"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Income(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    income_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    source = UnicodeAttribute()
    category = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Income<{self.user_id}, {self.date}, {self.source}, {self.amount}>"
