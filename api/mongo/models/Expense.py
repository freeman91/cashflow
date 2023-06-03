# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Expense Model"""

from datetime import datetime
from typing import Optional

from pydantic import Field

from .common import BaseModel, PydanticObjectId
from ..connection import database


class Expense(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    amount: float
    date: datetime
    type: str
    vendor: str
    description: Optional[str]
    paid: Optional[bool]
    bill_id: Optional[PydanticObjectId]
    asset_id: Optional[PydanticObjectId]
    category = "expense"

    def create(self):
        return database.expenses.insert_one(self.bson()).inserted_id

    def save(self):
        return database.expenses.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def delete(self):
        return database.expenses.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.category}, {self.id}, {self.amount}, {self.date.strftime('%Y-%m-%d')}>"
