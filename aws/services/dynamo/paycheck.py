# pylint: disable=too-many-arguments, arguments-renamed
"""Paycheck pynamodb model"""

import os
from typing import Dict, Optional
from datetime import datetime

from uuid import uuid4
from pynamodb.attributes import (
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
    MapAttribute,
)

from services import dynamo
from .base import BaseModel


TYPE = "paycheck"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class ContributionItemAttribute(MapAttribute):
    employer = NumberAttribute()
    employee = NumberAttribute()
    account_id = UnicodeAttribute(null=True)


class Paycheck(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    paycheck_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute(null=True)
    employer = UnicodeAttribute()

    take_home = NumberAttribute()
    taxes = NumberAttribute(null=True)
    retirement_contribution = ContributionItemAttribute(null=True)
    benefits_contribution = ContributionItemAttribute(null=True)
    other_benefits = NumberAttribute(null=True)
    other = NumberAttribute(null=True)
    deposit_to_id = UnicodeAttribute(null=True)
    description = UnicodeAttribute(null=True)

    def __repr__(self):
        return (
            f"Paycheck<{self.user_id}, {self.date}, {self.employer}, {self.take_home}>"
        )

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        employer: str,
        take_home: float,
        taxes: float = None,
        retirement_contribution: Dict = None,
        benefits_contribution: Dict = None,
        other_benefits: float = None,
        other: float = None,
        deposit_to_id: str = None,
        description: str = None,
    ) -> "Paycheck":
        paycheck = cls(
            user_id=user_id,
            paycheck_id=f"paycheck:{uuid4()}",
            date=_date,
            employer=employer,
            take_home=take_home,
            taxes=taxes,
            retirement_contribution=retirement_contribution,
            benefits_contribution=benefits_contribution,
            other_benefits=other_benefits,
            other=other,
            deposit_to_id=deposit_to_id,
            description=description,
        )
        paycheck.save()
        return paycheck

    @classmethod
    def create_template(
        cls,
        user_id: str,
        paycheck_id: str,
        employer: str,
        take_home: float,
        taxes: float = None,
        retirement_contribution: Dict = None,
        benefits_contribution: Dict = None,
        other_benefits: float = None,
        other: float = None,
        deposit_to_id: str = None,
        description: str = None,
    ) -> "Paycheck":
        paycheck = cls(
            user_id=user_id,
            paycheck_id=paycheck_id,
            employer=employer,
            take_home=take_home,
            taxes=taxes,
            retirement_contribution=retirement_contribution,
            benefits_contribution=benefits_contribution,
            other_benefits=other_benefits,
            other=other,
            deposit_to_id=deposit_to_id,
            description=description,
        )
        paycheck.save()
        return paycheck

    @classmethod
    def get_(cls, user_id: str, paycheck_id: str) -> "Paycheck":
        return super().get_(user_id, paycheck_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, paycheck_id: Optional[str] = None
    ) -> list["Paycheck"]:
        return super().list(user_id, paycheck_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(
            cls.query(
                user_id,
                cls.paycheck_id.startswith("paycheck"),
                filter_condition=cls.date.between(start, end),
            )
        )

    def update_account(self) -> dynamo.Asset:
        account = None
        if self.deposit_to_id.startswith("account"):
            account = dynamo.Account.get_(self.user_id, self.deposit_to_id)

            for attr in ["balance", "amount", "value"]:
                if getattr(account, attr, None):
                    setattr(account, attr, getattr(account, attr) + self.take_home)
                    continue
            account.save()

        account.save()
        return account
