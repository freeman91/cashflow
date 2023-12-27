"""Asset pynamodb model"""

import os
from datetime import datetime, timezone
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute
from .base import BaseModel


TYPE = "asset"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Asset(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    asset_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    account_id = UnicodeAttribute()
    name = UnicodeAttribute()
    value = NumberAttribute()
    category = UnicodeAttribute(default="")
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)
    vendor = UnicodeAttribute(null=True)  # remove
    last_update = UTCDateTimeAttribute(default=datetime.now(timezone.utc))

    def __repr__(self):
        return f"Asset<{self.user_id}, {self.name}, {self.value}>"
