from datetime import datetime
from bson.objectid import ObjectId

from api.db import database as db
from api.db.user import user


class ExpensesModel:
    name = "expense"
    types = user.item[name]["types"]
    vendors = user.item[name]["vendors"]
    attributes = {
        "_id": ObjectId,
        "date": datetime,
        "amount": float,
        "type": str,
        "vendor": str,
        "asset": str,
        "debt": str,
        "desc": str,
    }

    def get(self, id):
        return db.expenses.find_one({"_id": ObjectId(id)})

    def find_one(self):
        return db.expenses.find_one()

    def in_range(self, start: int, end: int):
        return [
            expense
            for expense in db.expenses.find(
                {
                    "date": {
                        "$gt": datetime.fromtimestamp(start),
                        "$lt": datetime.fromtimestamp(end),
                    }
                }
            )
        ]

    def get_all(self):
        return [expense for expense in db.expenses.find()]

    def create(self, expense: dict):
        return db.expenses.insert_one(self.__serialize__(**expense))

    def update(self, expense: dict):
        return db.expenses.replace_one(
            {"_id": ObjectId(expense["_id"])}, self.__serialize__(**expense)
        )

    def delete(self, id):
        return db.expenses.delete_one({"_id": ObjectId(id)})

    def delete_all(self):
        return db.expenses.delete_many({})

    def __serialize__(self, **expense):
        for attr in expense:
            if attr == "_id" and type(expense[attr]) == str:
                expense["_id"] = ObjectId(expense["_id"])
            elif attr == "date" and type(expense[attr]) == int:
                expense[attr] = datetime.fromtimestamp(expense[attr])
            assert attr in self.attributes
            assert type(expense[attr]) == self.attributes[attr]

        self.__verify_type__(expense["type"])
        self.__verify_vendor__(expense["vendor"])
        expense["category"] = "expense"
        return expense

    def __verify_type__(self, _type: str):
        if _type not in self.types:
            user.update_expense("types", self.types + [_type])

    def __verify_vendor__(self, vendor: str):
        if vendor not in self.vendors:
            user.update_expense("vendors", self.vendors + [vendor])


Expenses = ExpensesModel()
