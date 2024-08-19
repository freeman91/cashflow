# pylint: disable=too-many-arguments, arguments-renamed
"""Income pynamodb model"""

import os
from datetime import datetime
from typing import Optional
from uuid import uuid4
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from services import dynamo
from .base import BaseModel


TYPE = "income"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Income(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    income_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    source = UnicodeAttribute()
    category = UnicodeAttribute(null=True)
    deposit_to_id = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Income<{self.user_id}, {self.date}, {self.source}, {self.amount}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        amount: float,
        source: str,
        category: str,
        deposit_to_id: str = None,
        description: str = None,
    ) -> "Income":
        income = cls(
            user_id=user_id,
            income_id=f"income:{uuid4()}",
            date=_date,
            amount=amount,
            source=source,
            category=category,
            deposit_to_id=deposit_to_id,
            description=description,
        )
        income.save()
        return income

    @classmethod
    def get_(cls, user_id: str, income_id: str) -> "Income":
        return super().get_(user_id, income_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, income_id: Optional[str] = None
    ) -> list["Income"]:
        return super().list(user_id, income_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(
            cls.query(
                user_id,
                cls.income_id.startswith("income"),
                filter_condition=cls.date.between(start, end),
            )
        )

    def update_asset(self) -> dynamo.Asset:
        asset = None
        if self.deposit_to_id.startswith("asset"):
            asset = dynamo.Asset.get_(self.user_id, self.deposit_to_id)
            asset.value += self.amount
            asset.save()

        asset.save()
        return asset
