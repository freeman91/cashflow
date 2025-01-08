# pylint: disable=too-many-arguments, arguments-renamed
"""Account pynamodb model"""

import os
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
from pprint import pformat
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

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
    institution = UnicodeAttribute(null=True)
    amount = NumberAttribute(null=True)
    value = NumberAttribute(null=True)
    balance = NumberAttribute(null=True)
    account_type = UnicodeAttribute()
    asset_type = UnicodeAttribute(null=True)
    liability_type = UnicodeAttribute(null=True)
    subtype = UnicodeAttribute(null=True)
    url = UnicodeAttribute(null=True)
    interest_rate = NumberAttribute(null=True)
    icon_url = UnicodeAttribute(null=True)
    last_update = UTCDateTimeAttribute(default=datetime.now(timezone.utc))

    category = UnicodeAttribute(null=True)  # TODO: delete
    description = UnicodeAttribute(null=True)  # TODO: delete

    def __repr__(self):
        return f"Account<{self.user_id}, {self.name}>"

    def __str__(self):
        return pformat(self.as_dict())

    @classmethod
    def create(
        cls,
        user_id: str,
        name: str = "",
        institution: str = None,
        url: str = None,
        account_type: str = "",
        asset_type: str = None,
        liability_type: str = None,
        subtype: str = None,
        description: str = None,
        amount: float = None,
        value: float = None,
        balance: float = None,
        interest_rate: float = None,
        icon_url: Optional[str] = None,
    ) -> "Account":
        account = cls(
            user_id=user_id,
            account_id=f"account:{uuid4()}",
            name=name,
            institution=institution,
            url=url,
            account_type=account_type,
            asset_type=asset_type,
            liability_type=liability_type,
            subtype=subtype,
            description=description,
            amount=amount,
            value=value,
            balance=balance,
            interest_rate=interest_rate,
            icon_url=icon_url,
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
