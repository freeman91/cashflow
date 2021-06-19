from datetime import datetime

from api.db import database as db
from api.db.user import user


class HoursModel:
    name = "hour"
    attributes = {
        "date": datetime,
        "amount": float,
        "source": str,
        "desc": str,
    }

    def get(self, id):
        return db.hours.find_one({"_id": id})

    def find_one(self):
        return db.hours.find_one()

    def in_range(self, start: str, end: str):
        pass

    def get_all(self):
        return [hour for hour in db.hours.find()]

    def create(self, hour: dict):
        return db.hours.insert_one(self.__validate__(**hour))

    def update(self, hour: dict):
        return db.hours.replace_one({"_id": hour["_id"]}, self.__validate__(**hour))

    def delete(self, id):
        return db.hours.delete_one({"_id": id})

    def delete_all(self):
        return db.hours.delete_many({})

    def __validate__(self, **hour):
        for attr in hour:
            if attr == "_id":
                continue
            assert attr in self.attributes
            assert type(hour[attr]) == self.attributes[attr]

        assert hour["source"] in user.item["income"]["sources"]

        return hour


Hours = HoursModel()
