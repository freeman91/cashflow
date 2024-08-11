# pylint: disable=too-many-arguments, arguments-renamed
"""Account pynamodb model"""

import os
from typing import Optional
from uuid import uuid4
from pprint import pformat
from pynamodb.attributes import UnicodeAttribute

from .base import BaseModel


TYPE = "account"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Account(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    account_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    url = UnicodeAttribute(null=True)
    category = UnicodeAttribute(null=True)
    account_type = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Account<{self.user_id}, {self.name}>"

    def __str__(self):
        return pformat(self.as_dict())

    @classmethod
    def create(
        cls,
        user_id: str,
        name: str,
        account_type: str,
        url: str = None,
        description: str = None,
    ) -> "Account":
        account = cls(
            user_id=user_id,
            account_id=f"account:{uuid4()}",
            name=name,
            url=url,
            account_type=account_type,
            description=description,
        )
        account.save()
        return account

    @classmethod
    def get_(cls, user_id: str, account_id: str) -> "Account":
        return super().get_(user_id, account_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, account_id: Optional[str] = None
    ) -> list["Account"]:
        return super().list(user_id, account_id)
