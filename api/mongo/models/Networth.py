# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Networth Model"""

from datetime import datetime
from typing import Dict, List, Optional, Union

from pydantic import Field
from pydash import reduce_, get

from .common import BaseModel, PydanticObjectId
from ..connection import database


class Networth(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    date: datetime
    month: int
    year: int
    assets: List[Dict[str, Union[float, str]]]
    debts: List[Dict[str, Union[float, str]]]
    category = "networth"

    def create(self):
        return database.networths.insert_one(self.bson()).inserted_id

    def save(self):
        return database.networths.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def delete(self):
        return database.networths.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.category}, {self.id}, {self.year}, {self.month}>"

    def _sum(self, category):
        return reduce_(
            getattr(self, category),
            lambda acc, record: acc + get(record, "amount", 0),
            0,
        )
