# pylint: disable=too-many-arguments, arguments-renamed
"""Bill pynamodb model"""

import os
from typing import List, Optional
from uuid import uuid4
from datetime import datetime, timezone

from pynamodb.attributes import (
    NumberAttribute,
    ListAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from .. import dynamo
from .base import BaseModel

TYPE = "bill"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


class Bill(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    bill_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    amount = NumberAttribute()
    escrow = NumberAttribute(null=True)
    category = UnicodeAttribute()
    subcategory = UnicodeAttribute()
    vendor = UnicodeAttribute()
    day = NumberAttribute()
    months = ListAttribute()
    debt_id = UnicodeAttribute(null=True)
    payment_from_id = UnicodeAttribute(null=True)
    last_update = UTCDateTimeAttribute(default=datetime.now(timezone.utc))

    def __repr__(self):
        return f"Bill<{self.user_id}, {self.name}, {self.amount}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        name: str,
        amount: float,
        category: str,
        subcategory: str,
        vendor: str,
        day: str,
        months: List,
        debt_id: str,
        payment_from_id: str,
    ) -> "Bill":
        bill = cls(
            user_id=user_id,
            bill_id=f"bill:{uuid4()}",
            name=name,
            amount=amount,
            category=category,
            subcategory=subcategory,
            vendor=vendor,
            day=day,
            months=months,
            debt_id=debt_id,
            payment_from_id=payment_from_id,
            last_update=datetime.now(timezone.utc),
        )
        bill.save()
        return bill

    @classmethod
    def update_(cls, user_id: str, bill_id: str, **kwargs) -> "Bill":
        actions = []
        bill = cls.get(user_id, bill_id)
        bill.update(actions=[*actions, cls.last_update.set(datetime.now(timezone.utc))])
        return bill

    @classmethod
    def get_(cls, user_id: str, bill_id: str) -> "Bill":
        return super().get_(user_id, bill_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, bill_id: Optional[str] = None
    ) -> list["Bill"]:
        return super().list(user_id, bill_id)

    def generate(self, year: int, month: int):
        if self.debt_id:
            debt = dynamo.Debt.get_(user_id=USER_ID, debt_id=self.debt_id)
            interest = debt.amount * (debt.interest_rate / 12)
            principal = self.amount - interest
            escrow = None

            if hasattr(self, "escrow"):
                principal -= self.escrow
                escrow = self.escrow

            return dynamo.Repayment.create(
                user_id=debt.user_id,
                _date=datetime(year, month, self.day, 12, 0),
                principal=round(principal, 2),
                interest=round(interest, 2),
                escrow=round(escrow, 2) if escrow else None,
                lender=self.vendor,
                category=self.category,
                subcategory=self.subcategory,
                pending=True,
                debt_id=self.debt_id,
                bill_id=self.bill_id,
                payment_from_id=self.payment_from_id,
            )

        return dynamo.Expense.create(
            user_id=USER_ID,
            amount=self.amount,
            _date=datetime(year, month, self.day, 12, 0),
            category=self.category,
            subcategory=self.subcategory,
            vendor=self.vendor,
            pending=True,
            bill_id=self.bill_id,
            payment_from_id=self.payment_from_id,
        )
