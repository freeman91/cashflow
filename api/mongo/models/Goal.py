# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Goal Model"""

from datetime import datetime
from typing import Dict, Optional

from pydantic import Field

from .common import BaseModel, PydanticObjectId
from ..connection import database


class Goal(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    date: datetime
    year: int
    month: int
    values: Dict[str, float]
    description: Optional[str]
    category = "goal"

    def create(self):
        return database.goals.insert_one(self.bson()).inserted_id

    def save(self):
        return database.goals.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def delete(self):
        return database.goals.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.category}, {self.id}, {self.date}>"
