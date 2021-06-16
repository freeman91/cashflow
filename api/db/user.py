from pprint import pprint
from api.db import database as db
from api.db.__util__ import assert_list


class User:
    def __init__(self):
        self.user = db.users.find_one()

        if not self.user:
            user_item = {
                "name": "Addison Freeman",
                "email": "addisonmellow@hotmail.com",
                "networth": -10638.81,
                "income": {
                    "types": ["paycheck", "sale"],
                    "sources": ["DES", "Government", "broker", "other"],
                    "deductions": ["401k", "tax", "benefits", "other"],
                },
                "expense": {
                    "types": [],
                    "vendors": [],
                },
                "asset": {
                    "types": [
                        "cash",
                        "checking",
                        "stock",
                        "crypto",
                        "owed",
                        "savings",
                        "vehicle",
                    ],
                },
                "debt": {
                    "types": ["credit", "loan", "tuition"],
                },
            }

            db.users.insert_one(user_item)
            self.user = db.users.find_one()

    def __repr__(self) -> str:
        self._print()
        return ""

    def _print(self):
        pprint(self.user)

    def set(self):
        db.users.update_one({"_id": self.user["_id"]}, {"$set": self.user})
        self.user = db.users.find_one()

    def delete(self):
        db.users.delete_one({"_id": self.user["_id"]})

    def set_networth(self, networth: float):
        assert type(networth) == float or type(networth) == int

        self.user["networth"] = networth
        self.set()

    def set_income(self, c: str, l: list):
        assert_list(str, l)
        assert c == "types" or c == "sources" or c == "deductions"

        self.user["income"][c] = l
        self.set()

    def set_expense(self, c: str, l: list):
        assert_list(str, l)
        assert c == "types" or c == "vendors"

        self.user["expense"][c] = l
        self.set()

    def set_asset(self, c: str, l: list):
        assert_list(str, l)
        assert c == "types"

        self.user["asset"][c] = l
        self.set()

    def set_debt(self, c: str, l: list):
        assert_list(str, l)
        assert c == "types"

        self.user["debt"][c] = l
        self.set()
