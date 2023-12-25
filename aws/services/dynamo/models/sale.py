"""Sale pynamodb model"""

import os
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "sale"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Sale(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    sale_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    purchaser = UnicodeAttribute()
    asset_id = UnicodeAttribute(null=True)
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)

    def __repr__(self):
        return f"Sale<{self.user_id}, {self.asset_id}, {self.date}, {self.amount}>"
