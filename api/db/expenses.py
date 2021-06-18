from datetime import datetime

from api.db import database as db
from api.db.user import user


class ExpensesModel:
    name = "expense"
    types = user.item[name]["types"]
    vendors = user.item[name]["vendors"]
    attributes = {
        "date": datetime,
        "amount": float,
        "dedutctions": dict,
        "type": str,
        "vendor": str,
        "asset": str,
        "debt": str,
        "desc": str,
    }

    def get(self, id):
        return db.expenses.find_one({"_id": id})

    def find_one(self):
        return db.expenses.find_one()

    def in_range(self, start: str, end: str):
        pass

    def get_all(self):
        return [expense for expense in db.expenses.find()]

    def create(self, expense: dict):
        return db.expenses.insert_one(self.__validate__(**expense))

    def update(self, expense: dict):
        return db.expenses.replace_one(
            {"_id": expense["_id"]}, self.__validate__(**expense)
        )

    def delete(self, id):
        return db.expenses.delete_one({"_id": id})

    def delete_all(self):
        return db.expenses.delete_many({})

    def __validate__(self, **expense):
        for attr in expense:
            if attr == "_id":
                continue
            assert attr in self.attributes
            assert type(expense[attr]) == self.attributes[attr]

        self.__verify_type__(expense["type"])
        self.__verify_vendor__(expense["vendor"])

        return expense

    def __verify_type__(self, _type: str):
        if _type not in self.types:
            user.update_expense("types", self.types + [_type])

    def __verify_vendor__(self, vendor: str):
        if vendor not in self.vendors:
            user.update_expense("vendors", self.vendors + [vendor])


Expenses = ExpensesModel()
