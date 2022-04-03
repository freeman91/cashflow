# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Hour Model"""

from datetime import datetime
from typing import Optional

from pydantic import Field

from .common import BaseModel, PydanticObjectId
from ..connection import database


class Hour(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    amount: float
    date: datetime
    source: str
    description: Optional[str]
    category = "hour"

    def create(self):
        return database.hours.insert_one(self.bson()).inserted_id

    def save(self):
        return database.hours.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def delete(self):
        return database.hours.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.category}, {self.id}, {self.amount}, {self.date}>"
