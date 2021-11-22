from datetime import datetime
from bson.objectid import ObjectId

from api.db import database as db
from api.db.user import user


class GoalsModel:
    name = "goal"
    attributes = {
        "_id": ObjectId,
        "date": datetime,  # the 15th of every month
        "month": int,
        "year": int,
        "values": dict,
        "description": str,
    }

    def get(self, id):
        return db.goals.find_one({"_id": ObjectId(id)})

    def find_one(self):
        return db.goals.find_one()

    def in_range(self, start: int, end: int):
        return [
            goal
            for goal in db.goals.find(
                {
                    "date": {
                        "$gt": datetime.fromtimestamp(start),
                        "$lt": datetime.fromtimestamp(end),
                    }
                }
            )
        ]

    def get_all(self):
        return [goal for goal in db.goals.find()]

    def create(self, goal: dict):
        return db.goals.insert_one(self.__serialize__(**goal))

    def update(self, goal: dict):
        return db.goals.replace_one(
            {"_id": ObjectId(goal["_id"])}, self.__serialize__(**goal)
        )

    def delete(self, id):
        return db.goals.delete_one({"_id": ObjectId(id)})

    def delete_all(self):
        return db.goals.delete_many({})

    def __serialize__(self, **goal):
        for attr in goal:
            if attr == "_id" and type(goal[attr]) == str:
                goal["_id"] = ObjectId(goal["_id"])
            elif attr == "date" and type(goal[attr]) == int:
                goal[attr] = datetime.fromtimestamp(goal[attr])
            assert attr in self.attributes
            assert type(goal[attr]) == self.attributes[attr]

        self.__verify_values__(goal["values"])

        goal["category"] = "goal"
        return goal

    def __verify_values__(self, values):
        for value in values:
            assert value in user.item["goal"]["categories"]
            assert type(value) == str
            assert type(values[value]) == float


Goals = GoalsModel()
