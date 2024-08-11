# pylint: disable=too-many-arguments, arguments-renamed
"""Borrow pynamodb model"""

import os
from datetime import datetime
from typing import Optional
from uuid import uuid4
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "borrow"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Borrow(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    borrow_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    debt_id = UnicodeAttribute()
    amount = NumberAttribute()
    lender = UnicodeAttribute()

    def __repr__(self):
        return f"Borrow<{self.user_id}, {self.debt_id}, {self.date}, {self.amount}>"

    @classmethod
    def create(
        cls, user_id: str, _date: datetime, debt_id: str, amount: float, lender: str
    ) -> "Borrow":
        borrow = Borrow(
            user_id=user_id,
            borrow_id=f"borrow:{uuid4()}",
            date=_date,
            debt_id=debt_id,
            amount=amount,
            lender=lender,
        )
        borrow.save()
        return borrow

    @classmethod
    def get_(cls, user_id: str, borrow_id: str) -> "Borrow":
        return super().get_(user_id, borrow_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, borrow_id: Optional[str] = None
    ) -> list["Borrow"]:
        return super().list(user_id, borrow_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime) -> "Borrow":
        return list(
            cls.query(
                user_id,
                cls.borrow_id.startswith("borrow"),
                filter_condition=cls.date.between(start, end),
            )
        )
