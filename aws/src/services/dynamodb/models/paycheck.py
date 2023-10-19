"""Paycheck pynamodb model"""

import os
from pynamodb.models import Model
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

TYPE = "paycheck"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Paycheck(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

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
