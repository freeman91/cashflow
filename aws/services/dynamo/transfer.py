# pylint: disable=too-many-arguments, arguments-renamed
"""Transfer pynamodb model"""

import os
from datetime import datetime
from typing import List, Optional, Union
from uuid import uuid4
from pynamodb.attributes import (
    NumberAttribute,
    UnicodeAttribute,
    UTCDateTimeAttribute,
)

from services import dynamo
from .base import BaseModel

TYPE = "transfer"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Transfer(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    transfer_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    date = UTCDateTimeAttribute()
    amount = NumberAttribute()
    from_account_id = UnicodeAttribute()
    to_account_id = UnicodeAttribute()

    def __repr__(self):
        return f"Transfer<{self.user_id}, {self.date}, {self.amount}, {self.from_account_id}, {self.to_account_id}>"

    @classmethod
    def create(
        cls,
        user_id: str,
        _date: datetime,
        amount: float,
        from_account_id: str,
        to_account_id: str,
    ) -> "Transfer":
        transfer = cls(
            user_id=user_id,
            transfer_id=f"transfer:{uuid4()}",
            date=_date,
            amount=amount,
            from_account_id=from_account_id,
            to_account_id=to_account_id,
        )
        transfer.update_accounts()
        transfer.save()
        return transfer

    @classmethod
    def get_(cls, user_id: str, transfer_id: str) -> "Transfer":
        return super().get_(user_id, transfer_id)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, transfer_id: Optional[str] = None
    ) -> List["Transfer"]:
        return super().list(user_id, transfer_id)

    @classmethod
    def search(cls, user_id: str, start: datetime, end: datetime):
        return list(
            cls.query(
                user_id,
                cls.transfer_id.startswith("transfer"),
                filter_condition=cls.date.between(start, end),
            )
        )

    def update_accounts(self) -> None:
        from_account = dynamo.Account.get_(self.user_id, self.from_account_id)
        to_account = dynamo.Account.get_(self.user_id, self.to_account_id)

        from_account.value -= self.amount
        to_account.value += self.amount

        from_account.save()
        to_account.save()
