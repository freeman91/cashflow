# pylint: disable=too-many-arguments, arguments-renamed
"""Audit pynamodb model"""

import os
from datetime import datetime, timezone, timedelta
from typing import List, Optional
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "audit"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Audit(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    timestamp = UTCDateTimeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    action = UnicodeAttribute()
    status = UnicodeAttribute()
    message = UnicodeAttribute()
    ttl = UTCDateTimeAttribute()

    def __repr__(self):
        return f"Audit<{self.user_id}, {self.timestamp}, {self.action}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        action: str,
        status: str,
        message: str,
    ) -> "Audit":
        audit = cls(
            user_id=user_id,
            timestamp=datetime.now(timezone.utc),
            action=action,
            status=status,
            message=message,
            ttl=datetime.now(timezone.utc) + timedelta(days=30),
        )
        audit.save()
        return audit

    @classmethod
    def get_(cls, user_id: str, timestamp: str) -> "Audit":
        return super().get_(user_id, timestamp)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, timestamp: Optional[str] = None
    ) -> List["Audit"]:
        return super().list(user_id, timestamp)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(cls.query(user_id, cls.timestamp.between(start, end)))
