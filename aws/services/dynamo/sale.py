# pylint: disable=too-many-arguments, arguments-renamed
"""Sale pynamodb model"""

import os
from datetime import datetime
from typing import Optional
from uuid import uuid4
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from services import dynamo
from .base import BaseModel

TYPE = "sale"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Sale(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    sale_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    merchant = UnicodeAttribute(null=True)
    security_id = UnicodeAttribute(null=True)
    account_id = UnicodeAttribute(null=True)
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)
    fee = NumberAttribute(null=True)
    deposit_to_id = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Sale<{self.user_id}, {self.security_id}, {self.date}, {self.amount}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        amount: float,
        security_id: str,
        account_id: str,
        shares: float,
        price: float,
        merchant: str,
        fee: float,
        deposit_to_id: str,
    ) -> "Sale":
        sale = cls(
            user_id=user_id,
            sale_id=f"sale:{uuid4()}",
            date=_date,
            amount=amount,
            merchant=merchant,
            security_id=security_id,
            account_id=account_id,
            shares=shares,
            price=price,
            fee=fee,
            deposit_to_id=deposit_to_id,
        )
        sale.save()
        return sale

    @classmethod
    def get_(cls, user_id: str, sale_id: str) -> "Sale":
        return super().get_(user_id, sale_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, sale_id: Optional[str] = None
    ) -> list["Sale"]:
        return super().list(user_id, sale_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(
            cls.query(
                user_id,
                cls.sale_id.startswith("sale"),
                filter_condition=cls.date.between(start, end),
            )
        )

    def withdraw(self) -> "dynamo.Security":
        security = None
        if self.security_id.startswith("security"):
            security = dynamo.Security.get_(self.user_id, self.security_id)
            security.shares -= self.shares
            security.save()

        return security

    def deposit(self) -> dynamo.Account:
        account = None
        if self.deposit_to_id.startswith("account"):
            account = dynamo.Account.get_(self.user_id, self.deposit_to_id)
            account.value += self.amount
            account.save()

        account.save()
        return account
