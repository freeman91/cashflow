# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Income Model"""

from datetime import datetime
from typing import Dict, Optional

from pydantic import Field

from .common import BaseModel, PydanticObjectId
from ..connection import database


class Income(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    amount: float
    deductions: Dict[str, float]
    date: datetime
    type: str
    source: str
    description: Optional[str]
    asset: Optional[PydanticObjectId]
    category = "income"

    def create(self):
        return database.incomes.insert_one(self.bson()).inserted_id

    def save(self):
        return database.incomes.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def delete(self):
        return database.incomes.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.category}, {self.id}, {self.amount}, {self.date}>"
