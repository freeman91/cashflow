from datetime import datetime
from bson.objectid import ObjectId

from api.db import database as db
from api.db.user import user


class HoursModel:
    name = "hour"
    attributes = {
        "_id": ObjectId,
        "date": datetime,
        "amount": float,
        "source": str,
        "description": str,
        "category": str,
    }

    def get(self, _id):
        return db.hours.find_one({"_id": ObjectId(_id)})

    def find_one(self):
        return db.hours.find_one()

    def in_range(self, start: int, end: int):
        return [
            hour
            for hour in db.hours.find(
                {
                    "date": {
                        "$gt": datetime.fromtimestamp(start),
                        "$lt": datetime.fromtimestamp(end),
                    }
                }
            )
        ]

    def get_all(self):
        return [hour for hour in db.hours.find()]

    def create(self, hour: dict):
        return db.hours.insert_one(self.__serialize__(**hour))

    def update(self, hour: dict):
        return db.hours.replace_one(
            {"_id": ObjectId(hour["_id"])}, self.__serialize__(**hour)
        )

    def delete(self, _id):
        return db.hours.delete_one({"_id": ObjectId(_id)})

    def delete_all(self):
        return db.hours.delete_many({})

    def __serialize__(self, **hour):
        for attr in hour:
            if attr == "_id" and isinstance(hour[attr], str):
                hour["_id"] = ObjectId(hour["_id"])
            elif attr == "date" and isinstance(hour[attr], int):
                hour[attr] = datetime.fromtimestamp(hour[attr])
            assert attr in self.attributes
            assert isinstance(hour[attr], self.attributes[attr])

        assert hour["source"] in user.item["income"]["sources"]
        hour["category"] = "hour"
        return hour


Hours = HoursModel()
