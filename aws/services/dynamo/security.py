# pylint: disable=too-many-arguments, arguments-renamed
"""Security pynamodb model"""

import os
from typing import Optional
from uuid import uuid4
from datetime import datetime, timezone
from pynamodb.attributes import (
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)
from .base import BaseModel


TYPE = "security"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Security(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    security_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    ticker = UnicodeAttribute(null=True)
    account_id = UnicodeAttribute()
    security_type = UnicodeAttribute()
    shares = NumberAttribute()
    price = NumberAttribute()
    icon_url = UnicodeAttribute(null=True)
    last_update = UTCDateTimeAttribute(default=datetime.now(timezone.utc))

    def __repr__(self):
        return f"Security<{self.user_id}, {self.name}, {self.shares}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        account_id: str,
        name: str,
        security_type: str,
        ticker: str,
        shares: float,
        price: float,
        icon_url: Optional[str] = None,
    ) -> "Security":
        security = cls(
            user_id=user_id,
            security_id=f"security:{uuid4()}",
            account_id=account_id,
            name=name,
            ticker=ticker,
            security_type=security_type,
            shares=shares,
            price=price,
            icon_url=icon_url,
            last_update=datetime.now(timezone.utc),
        )
        security.save()
        return security

    @classmethod
    def update_(cls, user_id: str, security_id: str, **kwargs) -> "Security":
        actions = []
        security = cls.get(user_id, security_id)

        print(f"kwargs: {kwargs}")
        security.update(
            actions=[*actions, cls.last_update.set(datetime.now(timezone.utc))]
        )
        return security

    @classmethod
    def get_(cls, user_id: str, security_id: str) -> "Security":
        return super().get_(user_id, security_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, security_id: Optional[str] = None
    ) -> list["Security"]:
        return super().list(user_id, security_id)
