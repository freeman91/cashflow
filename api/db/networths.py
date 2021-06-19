from datetime import datetime
from pydash import reduce_

from api.db import database as db
from api.db.user import user


class NetworthsModel:
    name = "networth"
    attributes = {
        "month": int,
        "year": int,
        "assets": dict,
        "debts": dict,
    }

    def get(self, id):
        return db.networths.find_one({"_id": id})

    def find_one(self):
        return db.networths.find_one()

    def in_range(self, start: str, end: str):
        pass

    def get_all(self):
        return [networth for networth in db.networths.find()]

    def create(self, networth: dict):
        return db.networths.insert_one(self.__validate__(**networth))

    def update(self, networth: dict):
        return db.networths.replace_one(
            {"_id": networth["_id"]}, self.__validate__(**networth)
        )

    def delete(self, id):
        return db.networths.delete_one({"_id": id})

    def delete_all(self):
        return db.networths.delete_many({})

    def __validate__(self, **networth):
        for attr in networth:
            if attr == "_id":
                continue
            assert attr in self.attributes
            assert type(networth[attr]) == self.attributes[attr]

        self.__verify_values__(networth["assets"])
        self.__verify_values__(networth["debts"])

        return networth

    def __verify_values__(self, values):
        for value in values:
            assert type(value) == str
            assert type(values[value]) == float


Networths = NetworthsModel()
