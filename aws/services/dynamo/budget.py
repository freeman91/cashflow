# pylint: disable=too-many-arguments, arguments-renamed
"""Budget pynamodb model"""

import os
from datetime import datetime
from typing import List, Optional
from uuid import uuid4
from pynamodb.attributes import (
    ListAttribute,
    NumberAttribute,
    MapAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from .base import BaseModel

TYPE = "budget"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class CategoryMap(MapAttribute):
    category = UnicodeAttribute()
    goal = NumberAttribute()
    color = UnicodeAttribute()


class Budget(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    budget_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    year = NumberAttribute()
    month = NumberAttribute()
    categories = ListAttribute(of=CategoryMap)

    def __repr__(self):
        return f"Budget<{self.user_id}, {self.year}, {self.month}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        year: int,
        month: int,
        categories: List[CategoryMap],
    ) -> "Budget":
        budget = cls(
            user_id=user_id,
            budget_id=f"budget:{uuid4()}",
            date=_date,
            year=year,
            month=month,
            categories=categories,
        )
        budget.save()
        return budget

    @classmethod
    def get_(cls, user_id: str, budget_id: str) -> "Budget":
        return super().get_(user_id, budget_id)

    @classmethod
    def get_month(cls, user_id: str, year: int, month: int) -> "Budget":
        try:
            return next(
                cls.query(
                    user_id,
                    cls.budget_id.startswith("budget"),
                    (cls.year == year) & (cls.month == month),
                )
            )
        except StopIteration:
            return None

    @classmethod
    def list_year(cls, user_id: str, year: int) -> List["Budget"]:
        return cls.query(user_id, cls.budget_id.startswith("budget"), cls.year == year)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, budget_id: Optional[str] = None
    ) -> list["Budget"]:
        return super().list(user_id, budget_id)
