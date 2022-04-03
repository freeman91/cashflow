# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Debt Model"""

from datetime import datetime
from typing import Optional

from pydantic import Field

from .common import BaseModel, PydanticObjectId
from ..connection import database


class Debt(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    name: str
    value: float
    type: str
    vendor: Optional[str]
    description: Optional[str]
    last_update: datetime
    category = "debt"

    def create(self):
        return database.debts.insert_one(self.bson()).inserted_id

    def save(self):
        return database.debts.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def delete(self):
        return database.debts.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.category}, {self.id}, {self.amount}, {self.date}>"
