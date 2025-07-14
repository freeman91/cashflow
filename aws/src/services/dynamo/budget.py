# pylint: disable=too-many-arguments, arguments-renamed
"""Budget pynamodb model"""

import os
from typing import List, Optional
from pynamodb.attributes import (
    ListAttribute,
    NumberAttribute,
    MapAttribute,
    UnicodeAttribute,
)

from .base import BaseModel

TYPE = "budget"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class BudgetGoalMap(MapAttribute):
    name = UnicodeAttribute()
    goal = NumberAttribute()


class Budget(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    month = UnicodeAttribute(range_key=True)  # YYYY-MM
    _type = UnicodeAttribute(default=TYPE)

    incomes = ListAttribute(of=BudgetGoalMap)
    expenses = ListAttribute(of=BudgetGoalMap)
    savings = ListAttribute(of=BudgetGoalMap)

    def __repr__(self):
        return f"Budget<{self.user_id}, {self.month}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        month: str,
        incomes: List[BudgetGoalMap],
        expenses: List[BudgetGoalMap],
        savings: List[BudgetGoalMap],
    ) -> "Budget":
        budget = cls(
            user_id=user_id,
            month=month,
            incomes=incomes,
            expenses=expenses,
            savings=savings,
        )
        budget.save()
        return budget

    @classmethod
    def get_(cls, user_id: str, budget_id: str) -> "Budget":
        return super().get_(user_id, budget_id)

    @classmethod
    def list_year(cls, user_id: str, year: int) -> List["Budget"]:
        return cls.query(user_id, cls.month.startswith(f"{year}"))

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, budget_id: Optional[str] = None
    ) -> list["Budget"]:
        return super().list(user_id, budget_id)
