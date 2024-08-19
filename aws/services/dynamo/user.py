# pylint: disable=too-many-arguments, arguments-renamed, arguments-differ
"""User pynamodb model"""

import os
import bcrypt
from uuid import uuid4
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
    deposit_to_id = UnicodeAttribute(null=True)


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

    @classmethod
    def create(cls, email: str, name: str, password: str) -> "User":
        user = cls(
            user_id=f"user:{uuid4()}",
            email=email,
            name=name,
            password=bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()),
        )
        user.save()
        return user

    @classmethod
    def get_(cls, user_id: str) -> "User":
        return next(cls.query(user_id))

    def update_(self, body: dict) -> "User":
        paycheck_defaults = body.get("paycheck_defaults")

        for attr in [
            "employer",
            "take_home",
            "taxes",
            "retirement",
            "benefits",
            "other",
            "deposit_to_id",
        ]:
            setattr(self.paycheck_defaults, attr, paycheck_defaults.get(attr))

        self.save()
        return self
