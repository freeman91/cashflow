from datetime import datetime
from bson.objectid import ObjectId

from api.db import database as db


class NetworthsModel:
    name = "networth"
    attributes = {
        "_id": ObjectId,
        "date": datetime,
        "month": int,
        "year": int,
        "assets": dict,
        "debts": dict,
    }

    def get(self, id):
        return db.networths.find_one({"_id": ObjectId(id)})

    def find_one(self):
        return db.networths.find_one()

    def in_range(self, start: int, end: int):
        return [
            networth
            for networth in db.networths.find(
                {
                    "date": {
                        "$gt": datetime.fromtimestamp(start),
                        "$lt": datetime.fromtimestamp(end),
                    }
                }
            )
        ]

    def get_all(self):
        return [networth for networth in db.networths.find()]

    def create(self, networth: dict):
        return db.networths.insert_one(self.__serialize__(**networth))

    def update(self, networth: dict):
        return db.networths.replace_one(
            {"_id": ObjectId(networth["_id"])}, self.__serialize__(**networth)
        )

    def delete(self, id):
        return db.networths.delete_one({"_id": ObjectId(id)})

    def delete_all(self):
        return db.networths.delete_many({})

    def __serialize__(self, **networth):
        for attr in networth:
            if attr == "_id" and type(networth["_id"]) == str:
                networth["_id"] = ObjectId(networth["_id"])
            elif attr == "date" and type(networth[attr]) == int:
                networth[attr] = datetime.fromtimestamp(networth[attr])
            assert attr in self.attributes
            assert type(networth[attr]) == self.attributes[attr]

        self.__verify_values__(networth["assets"])
        self.__verify_values__(networth["debts"])
        networth["category"] = "networth"
        return networth

    def __verify_values__(self, values):
        for value in values:
            assert type(value) == str
            assert type(values[value]) == float


Networths = NetworthsModel()
