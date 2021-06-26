from datetime import datetime
from bson.objectid import ObjectId

from api.db import database as db
from api.db.user import user


class DebtsModel:
    name = "debt"
    types = user.item[name]["types"]
    attributes = {
        "_id": ObjectId,
        "name": str,
        "value": float,
        "type": str,
        "asset": str,
        "desc": str,
        "last_update": datetime,
    }

    def get(self, name):
        return db.debts.find_one({"name": name})

    def find_one(self):
        return db.debts.find_one()

    def get_all(self):
        return [debt for debt in db.debts.find()]

    def create(self, debt: dict):
        debt["last_update"] = datetime.now()
        return db.debts.insert_one(self.__serialize__(**debt))

    def update(self, debt: dict):
        debt["last_update"] = datetime.now()
        return db.debts.replace_one(
            {"_id": ObjectId(debt["_id"])}, self.__serialize__(**debt)
        )

    def delete(self, id):
        return db.debts.delete_one({"_id": ObjectId(id)})

    def delete_all(self):
        return db.debts.delete_many({})

    def __serialize__(self, **debt):
        for attr in debt:
            if attr == "_id" and type(debt[attr]) == str:
                debt["_id"] = ObjectId(debt["_id"])
            elif attr == "last_update" and type(debt[attr]) == int:
                debt[attr] = datetime.fromtimestamp(debt[attr])
            assert attr in self.attributes
            assert type(debt[attr]) == self.attributes[attr]
        assert debt["type"] in self.types
        debt["category"] = "debt"
        return debt


Debts = DebtsModel()


# def acquire():
#     """ "create new debt or update debt"""
#     pass


# def reduce(debt: str):
#     """
#     no expense generated
#     reduce debt amount
#     """
#     pass


# def pay_off():
#     """paying off a debt generates an expense
#     - reduce debt amount
#     - generate expense
#     """
#     pass
