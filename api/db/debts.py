from datetime import datetime

from api.db import database as db
from api.db.user import user


class DebtsModel:
    name = "debt"
    types = user.item[name]["types"]
    attributes = {
        "name": str,
        "value": float,
        "type": str,
        "asset": str,
        "desc": str,
    }

    def get(self, name):
        return db.debts.find_one({"name": name})

    def find_one(self):
        return db.debts.find_one()

    def in_range(self, start: str, end: str):
        pass

    def get_all(self):
        return [debt for debt in db.debts.find()]

    def create(self, debt: dict):
        return db.debts.insert_one(self.__validate__(**debt))

    def update(self, debt: dict):
        return db.debts.replace_one({"_id": debt["_id"]}, self.__validate__(**debt))

    def delete(self, id):
        return db.debts.delete_one({"_id": id})

    def delete_all(self):
        return db.debts.delete_many({})

    def __validate__(self, **debt):
        for attr in debt:
            if attr == "_id" or attr == "last_update":
                continue
            assert attr in self.attributes
            assert type(debt[attr]) == self.attributes[attr]
        assert debt["type"] in self.types
        debt["last_update"] = datetime.now()
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
