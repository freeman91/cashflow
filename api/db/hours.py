from datetime import datetime
from bson.objectid import ObjectId

from api.db import database as db
from api.db.user import user


class HoursModel:
    name = "hour"
    attributes = {
        "date": datetime,
        "amount": float,
        "source": str,
        "description": str,
    }

    def get(self, id):
        return db.hours.find_one({"_id": ObjectId(id)})

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

    def delete(self, id):
        return db.hours.delete_one({"_id": ObjectId(id)})

    def delete_all(self):
        return db.hours.delete_many({})

    def __serialize__(self, **hour):
        for attr in hour:
            if attr == "_id":
                continue
            assert attr in self.attributes
            assert type(hour[attr]) == self.attributes[attr]

        assert hour["source"] in user.item["income"]["sources"]
        hour["category"] = "hour"
        return hour


Hours = HoursModel()
