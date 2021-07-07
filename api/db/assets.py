from datetime import datetime
from bson.objectid import ObjectId

from api.db import database as db
from api.db.user import user


from datetime import datetime

from api.db import database as db
from api.db.user import user


class AssetsModel:
    name = "asset"
    types = user.item[name]["types"]
    attributes = {
        "_id": ObjectId,
        "name": str,
        "value": float,
        "type": str,
        "shares": float,
        "price": float,
        "ticker": str,
        "debt": str,
        "invested": float,
        "description": str,
        "last_update": datetime,
        "category": str,
    }

    def get(self, name):
        return db.assets.find_one({"name": name})

    def find_one(self):
        return db.assets.find_one()

    def get_all(self):
        return [asset for asset in db.assets.find()]

    def create(self, asset: dict):
        asset["last_update"] = datetime.now()
        return db.assets.insert_one(self.__serialize__(**asset))

    def update(self, asset: dict):
        asset["last_update"] = datetime.now()
        return db.assets.replace_one(
            {"_id": ObjectId(asset["_id"])}, self.__serialize__(**asset)
        )

    def delete(self, id):
        return db.assets.delete_one({"_id": ObjectId(id)})

    def delete_all(self):
        return db.assets.delete_many({})

    def __serialize__(self, **asset):
        for attr in asset:
            if attr == "_id" and type(asset[attr]) == str:
                asset["_id"] = ObjectId(asset["_id"])
            elif attr == "last_update" and type(asset[attr]) == int:
                asset[attr] = datetime.fromtimestamp(asset[attr])
            assert attr in self.attributes
            assert type(asset[attr]) == self.attributes[attr]
        assert asset["type"] in self.types
        asset["category"] = "asset"
        return asset


Assets = AssetsModel()


# def create():
#     """
#     create expense & asset
#     regular asset vs stock/crypto
#     """
#     pass


# def update():
#     pass


# def acquire():
#     """
#     acquiring an asset, no expense generated
#     asset created/updated
#     """
#     pass


# def purchase():
#     """purchasing an asset generates an expense"""

#     pass


# def sell():
#     """
#     selling an asset generates an income
#     """
#     pass
