# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Bill Model"""

from typing import Optional

from pydantic import Field

from .common import BaseModel, PydanticObjectId
from ..connection import database


class Bill(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    name: str
    amount: float
    type: str
    vendor: str
    rule: str
    description: Optional[str]
    category = "bill"

    def create(self):
        return database.bills.insert_one(self.bson()).inserted_id

    def save(self):
        return database.bills.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def delete(self):
        return database.bills.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.category}, {self.id}, {self.amount}>"
