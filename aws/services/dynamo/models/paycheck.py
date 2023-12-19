"""Paycheck pynamodb model"""

import os
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "paycheck"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Paycheck(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    paycheck_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    employer = UnicodeAttribute()

    take_home = NumberAttribute()
    gross = NumberAttribute(null=True)
    taxes = NumberAttribute(null=True)
    retirement = NumberAttribute(null=True)
    other = NumberAttribute(null=True)

    def __repr__(self):
        return (
            f"Paycheck<{self.user_id}, {self.date}, {self.employer}, {self.take_home}>"
        )
