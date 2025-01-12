# pylint: disable=too-many-arguments, arguments-renamed
"""Expense pynamodb model"""

import os
from datetime import datetime
from typing import List, Optional
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
    pending = BooleanAttribute(default=False)
    recurring_id = UnicodeAttribute(null=True)

    amount = NumberAttribute()
    merchant = UnicodeAttribute(null=True)
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    payment_from_id = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Expense<{self.user_id}, {self.date}, {self.merchant}, {self.amount}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        amount: float,
        merchant: str,
        category: str,
        subcategory: str,
        pending: bool = False,
        payment_from_id: str = None,
        recurring_id: str = None,
        description: str = None,
    ) -> "Expense":
        expense = cls(
            user_id=user_id,
            expense_id=f"expense:{uuid4()}",
            date=_date,
            amount=amount,
            category=category,
            subcategory=subcategory,
            merchant=merchant,
            pending=pending,
            payment_from_id=payment_from_id,
            recurring_id=recurring_id,
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
    ) -> List["Expense"]:
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

    def update_account(self) -> dynamo.Account:
        account = None
        if self.payment_from_id is None:
            return account

        if self.payment_from_id.startswith("account"):
            account = dynamo.Account.get_(self.user_id, self.payment_from_id)

            if account.account_type == "Asset":
                if account.balance:
                    account.balance -= self.amount
                    account.balance = round(account.balance, 2)
                if account.amount:
                    account.amount -= self.amount
                    account.amount = round(account.amount, 2)
            elif account.account_type == "Liability":
                account.amount += self.amount

            account.save()

        return account
