# pylint: disable=too-many-arguments, arguments-renamed, arguments-differ
"""History pynamodb model"""

import os
from typing import List, Optional
from pynamodb.attributes import (
    ListAttribute,
    NumberAttribute,
    MapAttribute,
    UnicodeAttribute,
)
from pynamodb.indexes import GlobalSecondaryIndex, AllProjection

from .base import BaseModel

TYPE = "history"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class UserIndex(GlobalSecondaryIndex):
    class Meta:
        index_name = f"{APP_ID}-{ENV}-{TYPE}s-user_id-index"
        projection = AllProjection()

    user_id = UnicodeAttribute(hash_key=True)
    month = UnicodeAttribute(range_key=True)


class ValueItem(MapAttribute):
    date = UnicodeAttribute()  # "YYYY-MM-DD"
    value = NumberAttribute(null=True)
    shares = NumberAttribute(null=True)
    price = NumberAttribute(null=True)


class History(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    item_id = UnicodeAttribute(hash_key=True)
    month = UnicodeAttribute(range_key=True)  # YYYY-MM
    _type = UnicodeAttribute(default=TYPE)

    account_type = UnicodeAttribute()
    user_id = UnicodeAttribute()
    values = ListAttribute(of=ValueItem)

    user_index = UserIndex()

    def __repr__(self):
        return f"History<{self.item_id}, {self.month}>"

    @classmethod
    def create(
        cls,
        item_id: str,
        month: str,
        account_type: str,
        user_id: str,
        values: List[ValueItem],
    ) -> "History":
        history = cls(
            user_id=user_id,
            item_id=item_id,
            month=month,
            account_type=account_type,
            values=values,
        )
        history.save()
        return history

    @classmethod
    def get_(cls, item_id: str, month: str) -> "History":
        return super().get_(item_id, month)

    @classmethod
    def list(
        cls, item_id: Optional[str] = None, month: Optional[str] = None
    ) -> List["History"]:
        return super().list(item_id, month)
