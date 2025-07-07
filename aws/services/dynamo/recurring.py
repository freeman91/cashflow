# pylint: disable=too-many-arguments, arguments-renamed
"""Recurring pynamodb model"""

import os
from typing import Optional, List
from uuid import uuid4
from datetime import datetime, timezone

from pynamodb.attributes import (
    BooleanAttribute,
    MapAttribute,
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from .. import dynamo
from .base import BaseModel

TYPE = "recurring"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class ExpenseAttributes(MapAttribute):
    amount = NumberAttribute()
    merchant = UnicodeAttribute(null=True)
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    payment_from_id = UnicodeAttribute(null=True)

    @classmethod
    def parse(cls, payload: dict):
        return cls(
            amount=float(payload.get("amount")),
            merchant=payload.get("merchant"),
            category=payload.get("category"),
            subcategory=payload.get("subcategory"),
            payment_from_id=payload.get("payment_from_id"),
        )


class RepaymentAttributes(MapAttribute):
    amount = NumberAttribute()
    escrow = NumberAttribute(null=True)
    merchant = UnicodeAttribute(null=True)
    category = UnicodeAttribute(default="")
    subcategory = UnicodeAttribute(default="")
    account_id = UnicodeAttribute(null=True)
    payment_from_id = UnicodeAttribute(null=True)

    @classmethod
    def parse(cls, payload: dict):
        return cls(
            amount=float(payload.get("amount")),
            escrow=float(payload.get("escrow")) if payload.get("escrow") else None,
            merchant=payload.get("merchant"),
            category=payload.get("category"),
            subcategory=payload.get("subcategory"),
            account_id=payload.get("account_id"),
            payment_from_id=payload.get("payment_from_id"),
        )


class PaycheckAttributes(MapAttribute):
    employer = UnicodeAttribute()
    take_home = NumberAttribute()
    taxes = NumberAttribute(null=True)
    retirement_contribution = dynamo.ContributionItemAttribute(null=True)
    benefits_contribution = dynamo.ContributionItemAttribute(null=True)
    other_benefits = NumberAttribute(null=True)
    other = NumberAttribute(null=True)
    deposit_to_id = UnicodeAttribute(null=True)

    @classmethod
    def parse(cls, payload: dict):
        taxes = payload.get("taxes")
        other_benefits = payload.get("other_benefits")
        other = payload.get("other")

        return cls(
            employer=payload.get("employer"),
            take_home=float(payload.get("take_home")),
            taxes=float(taxes) if taxes else 0,
            retirement_contribution=dynamo.ContributionItemAttribute.parse(
                payload.get("retirement_contribution") or {}
            ),
            benefits_contribution=dynamo.ContributionItemAttribute.parse(
                payload.get("benefits_contribution") or {}
            ),
            other_benefits=float(other_benefits) if other_benefits else 0,
            other=float(other) if other else 0,
            deposit_to_id=payload.get("deposit_to_id"),
        )


class IncomeAttributes(MapAttribute):
    amount = NumberAttribute()
    source = UnicodeAttribute()
    category = UnicodeAttribute(null=True)
    deposit_to_id = UnicodeAttribute(null=True)

    @classmethod
    def parse(cls, payload: dict):
        return cls(
            amount=float(payload.get("amount")),
            source=payload.get("source"),
            category=payload.get("category"),
            deposit_to_id=payload.get("deposit_to_id"),
        )


class Recurring(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    recurring_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    active = BooleanAttribute(default=True)
    item_type = UnicodeAttribute()
    name = UnicodeAttribute()
    frequency = UnicodeAttribute()  # one_of=["daily", "weekly", "monthly", "yearly"]
    interval = NumberAttribute(null=True)
    day_of_week = NumberAttribute(null=True)
    day_of_month = NumberAttribute(null=True)
    month_of_year = NumberAttribute(null=True)
    next_date = UTCDateTimeAttribute(null=True)
    last_update = UTCDateTimeAttribute(default=datetime.now(timezone.utc))

    expense_attributes = ExpenseAttributes(null=True)
    repayment_attributes = RepaymentAttributes(null=True)
    paycheck_attributes = PaycheckAttributes(null=True)
    income_attributes = IncomeAttributes(null=True)

    def __repr__(self):
        return f"Recurring<{self.user_id}, {self.item_type}, {self.name}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        item_type: str,
        name: str,
        frequency: str,
        active: bool = True,
        interval: Optional[int] = None,
        day_of_week: Optional[int] = None,
        day_of_month: Optional[int] = None,
        month_of_year: Optional[int] = None,
        next_date: Optional[datetime] = None,
        expense_attributes: Optional[ExpenseAttributes] = None,
        repayment_attributes: Optional[RepaymentAttributes] = None,
        paycheck_attributes: Optional[PaycheckAttributes] = None,
        income_attributes: Optional[IncomeAttributes] = None,
    ) -> "Recurring":
        recurring = cls(
            user_id=user_id,
            recurring_id=f"recurring:{uuid4()}",
            active=active,
            item_type=item_type,
            name=name,
            frequency=frequency,
            interval=interval,
            day_of_week=day_of_week,
            day_of_month=day_of_month,
            month_of_year=month_of_year,
            next_date=next_date,
            expense_attributes=None,
            repayment_attributes=None,
            paycheck_attributes=None,
            income_attributes=None,
            last_update=datetime.now(timezone.utc),
        )

        if item_type == "expense":
            recurring.expense_attributes = ExpenseAttributes.parse(expense_attributes)
        elif item_type == "repayment":
            recurring.repayment_attributes = RepaymentAttributes.parse(
                repayment_attributes
            )
        elif item_type == "paycheck":
            recurring.paycheck_attributes = PaycheckAttributes.parse(
                paycheck_attributes
            )
        elif item_type == "income":
            recurring.income_attributes = IncomeAttributes.parse(income_attributes)

        recurring.save()
        return recurring

    @classmethod
    def get_(cls, user_id: str, recurring_id: str) -> "Recurring":
        return super().get_(user_id, recurring_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, recurring_id: Optional[str] = None
    ) -> List["Recurring"]:
        return super().list(user_id, recurring_id)

    def generate(self, year: int, month: int, day: int):
        if self.item_type == "repayment":
            debt = dynamo.Account.get_(
                user_id=self.user_id, account_id=self.repayment_attributes.account_id
            )
            interest = debt.amount * (debt.interest_rate / 12)
            principal = self.repayment_attributes.amount - interest
            escrow = None

            if (
                hasattr(self.repayment_attributes, "escrow")
                and self.repayment_attributes.escrow
            ):
                principal -= self.repayment_attributes.escrow
                escrow = self.repayment_attributes.escrow

            return dynamo.Repayment.create(
                user_id=self.user_id,
                _date=datetime(year, month, day, 12, 0),
                pending=True,
                principal=round(principal, 2),
                interest=round(interest, 2),
                escrow=round(escrow, 2) if escrow else None,
                merchant=self.repayment_attributes.merchant,
                category=self.repayment_attributes.category,
                subcategory=self.repayment_attributes.subcategory,
                account_id=self.repayment_attributes.account_id,
                recurring_id=self.recurring_id,
                payment_from_id=self.repayment_attributes.payment_from_id,
                description=self.name,
            )

        if self.item_type == "expense":
            return dynamo.Expense.create(
                user_id=self.user_id,
                _date=datetime(year, month, day, 12, 0),
                pending=True,
                amount=self.expense_attributes.amount,
                merchant=self.expense_attributes.merchant,
                category=self.expense_attributes.category,
                subcategory=self.expense_attributes.subcategory,
                recurring_id=self.recurring_id,
                payment_from_id=self.expense_attributes.payment_from_id,
                description=self.name,
            )

        if self.item_type == "paycheck":
            return dynamo.Paycheck.create(
                user_id=self.user_id,
                _date=datetime(year, month, day, 12, 0),
                pending=True,
                employer=self.paycheck_attributes.employer,
                take_home=self.paycheck_attributes.take_home,
                recurring_id=self.recurring_id,
                taxes=self.paycheck_attributes.taxes,
                retirement_contribution=self.paycheck_attributes.retirement_contribution,
                benefits_contribution=self.paycheck_attributes.benefits_contribution,
                other_benefits=self.paycheck_attributes.other_benefits,
                other=self.paycheck_attributes.other,
                deposit_to_id=self.paycheck_attributes.deposit_to_id,
                description=self.name,
            )

        if self.item_type == "income":
            return dynamo.Income.create(
                user_id=self.user_id,
                _date=datetime(year, month, day, 12, 0),
                pending=True,
                amount=self.income_attributes.amount,
                source=self.income_attributes.source,
                category=self.income_attributes.category,
                deposit_to_id=self.income_attributes.deposit_to_id,
                recurring_id=self.recurring_id,
                description=self.name,
            )

        raise ValueError(f"Invalid item type: {self.item_type}")
