# pylint: disable=too-many-arguments, arguments-renamed, line-too-long
"""Repayment pynamodb model"""

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

TYPE = "repayment"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Repayment(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    repayment_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    principal = NumberAttribute()
    interest = NumberAttribute()
    escrow = NumberAttribute(null=True)
    merchant = UnicodeAttribute(null=True)
    pending = BooleanAttribute(default=False)
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    account_id = UnicodeAttribute(null=True)
    bill_id = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)
    payment_from_id = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Repayment<{self.user_id}, {self.date}, {self.merchant}, {self.principal}, {self.interest}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        principal: float,
        interest: float,
        merchant: str,
        category: str,
        subcategory: str,
        account_id: str,
        escrow: float = None,
        bill_id: str = None,
        pending: bool = False,
        description: str = None,
        payment_from_id: str = None,
    ) -> "Repayment":
        repayment = cls(
            user_id=user_id,
            repayment_id=f"repayment:{uuid4()}",
            date=_date,
            principal=principal,
            interest=interest,
            escrow=escrow,
            merchant=merchant,
            category=category,
            subcategory=subcategory,
            account_id=account_id,
            bill_id=bill_id,
            pending=pending,
            description=description,
            payment_from_id=payment_from_id,
        )
        repayment.save()
        return repayment

    @classmethod
    def get_(cls, user_id: str, repayment_id: str) -> "Repayment":
        return super().get_(user_id, repayment_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, repayment_id: Optional[str] = None
    ) -> List["Repayment"]:
        return super().list(user_id, repayment_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(
            cls.query(
                user_id,
                cls.repayment_id.startswith("repayment"),
                filter_condition=cls.date.between(start, end),
            )
        )

    def update_account(self) -> dynamo.Account:
        account = None
        if self.payment_from_id is None:
            return account

        total = self.principal + self.interest + (self.escrow or 0)
        if self.payment_from_id.startswith("account"):
            account = dynamo.Account.get_(self.user_id, self.payment_from_id)

            if account.account_type == "Asset":
                if account.balance:
                    account.balance -= total
                if account.amount:
                    account.amount -= total
            elif account.account_type == "Liability":
                account.amount += total

            account.value = round(account.value, 2)
            account.save()

        return account

    def update_account_principal(self) -> dynamo.Account:
        account = dynamo.Account.get_(self.user_id, self.account_id)
        account.amount -= self.principal
        account.save()
        return account
