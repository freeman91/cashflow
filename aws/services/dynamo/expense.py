# pylint: disable=too-many-arguments, arguments-renamed
"""Expense pynamodb model"""

import os
from datetime import datetime
from typing import Optional, Union
from uuid import uuid4
from pynamodb.attributes import (
    BooleanAttribute,
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from services import dynamo
from .base import BaseModel

TYPE = "expense"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Expense(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    expense_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    vendor = UnicodeAttribute(null=True)
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    pending = BooleanAttribute(default=False)
    bill_id = UnicodeAttribute(null=True)
    payment_from_id = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Expense<{self.user_id}, {self.date}, {self.vendor}, {self.amount}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        amount: float,
        vendor: str,
        category: str,
        subcategory: str,
        pending: bool = False,
        bill_id: str = None,
        payment_from_id: str = None,
        description: str = None,
    ) -> "Expense":
        expense = cls(
            user_id=user_id,
            expense_id=f"expense:{uuid4()}",
            date=_date,
            amount=amount,
            category=category,
            subcategory=subcategory,
            vendor=vendor,
            pending=pending,
            bill_id=bill_id,
            payment_from_id=payment_from_id,
            description=description,
        )
        expense.save()
        return expense

    @classmethod
    def get_(cls, user_id: str, expense_id: str) -> "Expense":
        return super().get_(user_id, expense_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, expense_id: Optional[str] = None
    ) -> list["Expense"]:
        return super().list(user_id, expense_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(
            cls.query(
                user_id,
                cls.expense_id.startswith("expense"),
                filter_condition=cls.date.between(start, end),
            )
        )

    def update_subaccount(self) -> Union[dynamo.Asset, dynamo.Debt]:
        subaccount = None
        if self.payment_from_id is None:
            return subaccount

        if self.payment_from_id.startswith("asset"):
            subaccount = dynamo.Asset.get_(self.user_id, self.payment_from_id)
            subaccount.value -= self.amount
            subaccount.save()
        elif self.payment_from_id.startswith("debt"):
            subaccount = dynamo.Debt.get_(self.user_id, self.payment_from_id)
            subaccount.amount += self.amount
            subaccount.save()

        subaccount.save()
        return subaccount
