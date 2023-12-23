"""User pynamodb model"""

import os
import bcrypt
from pynamodb.attributes import (
    BinaryAttribute,
    MapAttribute,
    NumberAttribute,
    UnicodeAttribute,
)

from .base import BaseModel


TYPE = "user"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class PaycheckDefaults(MapAttribute):
    employer = UnicodeAttribute(null=True)
    take_home = NumberAttribute(null=True)
    taxes = NumberAttribute(null=True)
    retirement = NumberAttribute(null=True)
    benefits = NumberAttribute(null=True)
    other = NumberAttribute(null=True)


class User(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    password = BinaryAttribute()
    paycheck_defaults = PaycheckDefaults(default={})

    def __repr__(self):
        return f"User<{self.user_id}, {self.email}, {self.name}>"

    def verify_password(self, input_password: str):
        return bcrypt.checkpw(input_password.encode("utf-8"), self.password)
