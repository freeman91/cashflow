# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Asset Model"""

from datetime import datetime
from typing import Optional

from pydantic import Field

from .common import BaseModel, PydanticObjectId
from ..connection import database


class Account(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    name: str
    url: str
    last_update: datetime
    description: str
    category = "account"

    def create(self):
        return database.accounts.insert_one(self.bson()).inserted_id

    def save(self):
        self.last_update = datetime.now()
        return database.accounts.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def delete(self):
        return database.accounts.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.name}>"
