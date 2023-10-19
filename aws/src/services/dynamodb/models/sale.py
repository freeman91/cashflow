"""Sale pynamodb model"""

import os
from pynamodb.models import Model
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute


TYPE = "sale"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Sale(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

    user_id = UnicodeAttribute(hash_key=True)
    sale_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    asset_id = UnicodeAttribute()
    amount = NumberAttribute()
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)
    purchaser = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Sale<{self.user_id}, {self.asset_id}, {self.date}, {self.amount}>"
