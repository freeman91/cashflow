# pylint: disable=too-many-arguments, arguments-renamed
"""Paycheck pynamodb model"""

import os
from datetime import datetime
from typing import Optional
from uuid import uuid4
from pynamodb.attributes import NumberAttribute, UnicodeAttribute, UTCDateTimeAttribute

from .base import BaseModel

TYPE = "paycheck"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Paycheck(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    paycheck_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    employer = UnicodeAttribute()

    take_home = NumberAttribute()
    taxes = NumberAttribute(null=True)
    retirement = NumberAttribute(null=True)
    benefits = NumberAttribute(null=True)
    other = NumberAttribute(null=True)
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
        retirement: float = None,
        benefits: float = None,
        other: float = None,
        description: str = None,
    ) -> "Paycheck":
        paycheck = cls(
            user_id=user_id,
            paycheck_id=f"paycheck:{uuid4()}",
            date=_date,
            employer=employer,
            take_home=take_home,
            taxes=taxes,
            retirement=retirement,
            benefits=benefits,
            other=other,
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
