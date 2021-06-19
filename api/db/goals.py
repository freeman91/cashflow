from datetime import datetime

from api.db import database as db
from api.db.user import user


class GoalsModel:
    name = "goal"
    attributes = {
        "date": datetime,
        "month": int,
        "year": int,
        "values": dict,
        "desc": str,
    }

    def get(self, id):
        return db.goals.find_one({"_id": id})

    def find_one(self):
        return db.goals.find_one()

    def in_range(self, start: datetime, end: datetime):
        return [goal for goal in db.goals.find({"date": {"$gt": start, "$lt": end}})]

    def get_all(self):
        return [goal for goal in db.goals.find()]

    def create(self, goal: dict):
        new_exp = self.__validate__(**goal)
        return db.goals.insert_one(new_exp)

    def update(self, goal: dict):
        return db.goals.replace_one({"_id": goal["_id"]}, self.__validate__(**goal))

    def delete(self, id):
        return db.goals.delete_one({"_id": id})

    def delete_all(self):
        return db.goals.delete_many({})

    def __validate__(self, **goal):
        for attr in goal:
            if attr == "_id":
                continue
            assert attr in self.attributes
            assert type(goal[attr]) == self.attributes[attr]

        self.__verify_values__(goal["values"])

        return goal

    def __verify_values__(self, values):
        for value in values:
            assert value in user.item["expense"]["types"]
            assert type(value) == str
            assert type(values[value]) == float


Goals = GoalsModel()
