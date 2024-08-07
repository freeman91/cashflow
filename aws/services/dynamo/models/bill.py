"""Bill pynamodb model"""

import os
from datetime import datetime, timezone
from pynamodb.attributes import (
    NumberAttribute,
    ListAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from services import dynamo
from .base import BaseModel

TYPE = "bill"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


class Bill(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    bill_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    amount = NumberAttribute()
    category = UnicodeAttribute()
    subcategory = UnicodeAttribute()
    vendor = UnicodeAttribute()
    day = NumberAttribute()
    months = ListAttribute()
    debt_id = UnicodeAttribute(null=True)
    last_update = UTCDateTimeAttribute(default=datetime.now(timezone.utc))

    def __repr__(self):
        return f"Bill<{self.user_id}, {self.name}, {self.amount}>"

    def generate(self, year: int, month: int):
        if self.debt_id:
            debt = dynamo.debt.get(user_id=USER_ID, debt_id=self.debt_id)
            interest = debt.amount * (debt.interest_rate / 12)
            principal = self.amount - interest
            escrow = None

            if self.subcategory == "mortgage":
                # TODO: ?
                escrow = 320.81
                principal -= escrow

            return dynamo.repayment.create(
                user_id=debt.user_id,
                _date=datetime(year, month, self.day, 12, 0),
                principal=principal,
                interest=interest,
                escrow=escrow,
                lender=self.vendor,
                category=self.category,
                subcategory=self.subcategory,
                pending=True,
                debt_id=self.debt_id,
                bill_id=self.bill_id,
                description=self.name,
            )

        return dynamo.expense.create(
            user_id=USER_ID,
            amount=self.amount,
            _date=datetime(year, month, self.day, 12, 0),
            category=self.category,
            subcategory=self.subcategory,
            vendor=self.vendor,
            pending=True,
            bill_id=self.bill_id,
            description=self.name,
        )
