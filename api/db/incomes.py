from datetime import datetime
from bson.objectid import ObjectId

from api.db import database as db
from api.db.user import user


class IncomesModel:
    name = "income"
    types = user.item[name]["types"]
    sources = user.item[name]["sources"]
    deduction_types = user.item[name]["deductions"]
    attributes = {
        "_id": ObjectId,
        "date": datetime,
        "amount": float,
        "type": str,
        "deductions": dict,
        "source": str,
        "asset": str,
        "description": str,
        "category": str,
    }

    def get(self, _id):
        return db.incomes.find_one({"_id": ObjectId(_id)})

    def find_one(self):
        return db.incomes.find_one()

    def in_range(self, start: int, end: int):
        return [
            income
            for income in db.incomes.find(
                {
                    "date": {
                        "$gt": datetime.fromtimestamp(start),
                        "$lt": datetime.fromtimestamp(end),
                    }
                }
            )
        ]

    def get_all(self):
        return [income for income in db.incomes.find()]

    def create(self, income: dict):
        return db.incomes.insert_one(self.__serialize__(**income))

    def update(self, income: dict):
        return db.incomes.replace_one(
            {"_id": ObjectId(income["_id"])}, self.__serialize__(**income)
        )

    def delete(self, _id):
        return db.incomes.delete_one({"_id": ObjectId(_id)})

    def delete_all(self):
        return db.incomes.delete_many({})

    def __serialize__(self, **income):
        for attr in income:
            if attr == "_id" and isinstance(income[attr], str):
                income["_id"] = ObjectId(income["_id"])
            elif attr == "date" and isinstance(income[attr], int):
                income[attr] = datetime.fromtimestamp(income[attr])
            assert attr in self.attributes
            assert isinstance(income[attr], self.attributes[attr])

        self.__verify_type__(income["type"])
        self.__verify_source__(income["source"])
        self.__verify_deduction_types__(income["deductions"])

        income["category"] = "income"
        return income

    def __verify_type__(self, _type: str):
        if _type not in self.types:
            user.update_setting("income", "types", self.types + [_type])

    def __verify_source__(self, source: str):
        if source not in self.sources:
            user.update_setting("income", "sources", self.sources + [source])

    def __verify_deduction_types__(self, deduction_types: dict):
        for _type in deduction_types:
            assert isinstance(_type, str)
            assert isinstance(deduction_types[_type], float)
            assert _type in self.deduction_types


Incomes = IncomesModel()
