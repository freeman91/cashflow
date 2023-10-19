"""Bill pynamodb model"""

import os
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute

TYPE = "bill"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Bill(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

    user_id = UnicodeAttribute(hash_key=True)
    bill_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    amount = UnicodeAttribute()
    vendor = UnicodeAttribute()
    rule = UnicodeAttribute()
    generation_type = UnicodeAttribute()

    def __repr__(self):
        return f"Bill<{self.user_id}, {self.name}, {self.amount}>"
