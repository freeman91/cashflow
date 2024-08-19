# pylint: disable=too-many-arguments, arguments-renamed, line-too-long
"""Repayment pynamodb model"""

import os
from datetime import datetime
from typing import Optional, Union
from uuid import uuid4
from pydash import get
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
    lender = UnicodeAttribute()
    pending = BooleanAttribute(default=False)
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    debt_id = UnicodeAttribute()
    bill_id = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)
    payment_from_id = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Repayment<{self.user_id}, {self.date}, {self.lender}, {self.principal}, {self.interest}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        principal: float,
        interest: float,
        lender: str,
        category: str,
        subcategory: str,
        debt_id: str,
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
            lender=lender,
            category=category,
            subcategory=subcategory,
            debt_id=debt_id,
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
    ) -> list["Repayment"]:
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

    def update_subaccount(self) -> Union[dynamo.Asset, dynamo.Debt]:
        subaccount = None

        total = self.principal + self.interest + get(self, "escrow", 0)
        if self.payment_from_id.startswith("asset"):
            subaccount = dynamo.Asset.get_(self.user_id, self.payment_from_id)
            subaccount -= total
            subaccount.save()
        elif self.payment_from_id.startswith("debt"):
            subaccount = dynamo.Debt.get_(self.user_id, self.payment_from_id)
            subaccount.amount += total
            subaccount.save()

        subaccount.save()
        return subaccount
