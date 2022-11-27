# pylint: disable=missing-function-docstring, missing-class-docstring, invalid-name
"""Asset Model"""

from datetime import datetime
from typing import Optional

from pydantic import Field

from api import mongo
from .common import BaseModel, PydanticObjectId
from ..connection import database


class Asset(BaseModel):
    id: Optional[PydanticObjectId] = Field(None, alias="_id")
    account_id: str
    name: str
    value: float
    type: str
    shares: Optional[float]
    price: Optional[float]
    vendor: Optional[str]
    debt: Optional[PydanticObjectId]
    invested: Optional[float]
    description: Optional[str]
    last_update: datetime
    category = "asset"

    def create(self):
        return database.assets.insert_one(self.bson()).inserted_id

    def save(self):
        self.last_update = datetime.now()
        return database.assets.replace_one(
            {"_id": PydanticObjectId(self.id)}, self.bson()
        )

    def buy(self, vendor: str, shares: float, price: float):

        buy_value = shares * price
        self.shares = self.shares + shares
        self.invested = self.invested + buy_value
        self.value = self.shares * self.price
        self.save()

        # generate expense
        new_expense = mongo.expense.create(
            {
                "date": datetime.now(),
                "amount": buy_value,
                "type": "asset",
                "vendor": vendor,
                "asset": self.id,
                "description": f"bought {shares} shares of {self.name}",
            }
        )

        return {"updated_asset": self, "new_expense": new_expense}

    def sell(self, source: str, shares: float, price: float):

        sell_value = shares * price
        self.shares = self.shares - shares
        self.invested = self.invested - sell_value
        self.value = self.shares * self.price
        self.save()

        new_income = mongo.income.create(
            {
                "date": datetime.now(),
                "amount": sell_value,
                "type": "sale",
                "source": source,
                "asset": self.id,
                "deductions": {},
                "description": f"sold {shares} shares of {self.name}",
            }
        )

        return {"updated_asset": self, "new_income": new_income}

    def delete(self):
        return database.assets.delete_one({"_id": PydanticObjectId(self.id)})

    def __repr__(self):
        return f"<{self.name}, {self.id}, {self.value}>"
