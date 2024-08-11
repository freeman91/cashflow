# pylint: disable=too-many-arguments, arguments-renamed
"""Debt pynamodb model"""

import os
from datetime import datetime, timezone
from typing import Optional
from uuid import uuid4
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "debt"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Debt(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    debt_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    account_id = UnicodeAttribute()
    name = UnicodeAttribute()
    lender = UnicodeAttribute(null=True)
    amount = NumberAttribute()
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    interest_rate = NumberAttribute(null=True)
    last_update = UTCDateTimeAttribute()

    def __repr__(self):
        return f"Debt<{self.user_id}, {self.name}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        account_id: str,
        name: str,
        amount: float,
        category: str,
        subcategory: str,
        interest_rate: float = None,
    ) -> "Debt":
        debt = cls(
            user_id=user_id,
            debt_id=f"debt:{uuid4()}",
            account_id=account_id,
            name=name,
            amount=amount,
            category=category,
            subcategory=subcategory,
            interest_rate=interest_rate,
            last_update=datetime.now(timezone.utc),
        )
        debt.save()
        return debt

    @classmethod
    def get_(cls, user_id: str, debt_id: str) -> "Debt":
        return super().get_(user_id, debt_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, debt_id: Optional[str] = None
    ) -> list["Debt"]:
        return super().list(user_id, debt_id)

    @classmethod
    def update_(cls, user_id: str, debt_id: str, **kwargs) -> "Debt":
        actions = []
        debt = cls.get(user_id, debt_id)

        print(f"kwargs: {kwargs}")

        debt.update(actions=[*actions, cls.last_update.set(datetime.now(timezone.utc))])

        return debt
