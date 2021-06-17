from datetime import datetime

from api.db import database as db
from api.db.user import user


class ExpensesModel:
    name = "expenses"

    def get_all(self):
        return [expense for expense in db.expenses.find()]

    def delete_all(self):
        return db.expenses.delete_many({})

    def in_range(self, start: str, end: str):
        pass

class ExpenseModel:
    name = "expense"
    types = user.item[name]["types"]
    vendors = user.item[name]["vendors"]

    def get(self, id):
        expense = db.expenses.find_one({"_id": id})
        return db.expenses.find_one(self.__validate__(**expense))

    def create(self, expense: dict):
        new_exp = self.__validate__(**expense)
        del new_exp["_id"]
        return db.expenses.insert_one(new_exp)

    def update(self, expense: dict):
        return db.expense.update_one(self.__validate__(**expense))

    def delete(self, id):
        return db.expenses.delete_one({"_id": id})

    def __validate__(self, **kwargs):
        assert type(kwargs["date"]) == datetime
        assert type(kwargs["amount"]) == int or type(kwargs["amount"]) == float
        assert type(kwargs["type"]) == str
        assert type(kwargs["vendor"]) == str
        assert type(kwargs["asset"]) == str
        assert type(kwargs["debt"]) == str
        assert type(kwargs["desc"]) == str

        self.__verify_type__(kwargs["type"])
        self.__verify_vendor__(kwargs["vendor"])

        return {
            "_id": kwargs["_id"] if "id" in list(kwargs.keys()) else None,
            "date": kwargs["date"],
            "amount": kwargs["amount"],
            "type": kwargs["type"],
            "vendor": kwargs["vendor"],
            "asset": kwargs["asset"],
            "debt": kwargs["debt"],
            "desc": kwargs["desc"],
        }

    def __verify_type__(self, _type: str):
        if _type not in self.types:
            user.update_expense("types", self.types + [_type])

    def __verify_vendor__(self, _vendor: str):
        if _vendor not in self.vendors:
            user.update_expense("vendors", self.vendors + [_vendor])


Expense = ExpenseModel()
Expenses = ExpensesModel()
