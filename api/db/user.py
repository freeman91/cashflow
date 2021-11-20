from pprint import pprint
from api.db import (
    database as db,
    NAME,
    EMAIL,
    INCOME_TYPES,
    INCOME_SOURCES,
    INCOME_DEDUCTIONS,
    EXPENSE_TYPES,
    EXPENSE_VENDORS,
    ASSET_TYPES,
    DEBT_TYPES,
)
from api.db.__util__ import assert_list


class User:
    income_attrs = ["types", "sources", "deductions"]
    expense_attrs = ["types", "vendors"]
    assets_attrs = ["types"]
    debts_attrs = ["types"]

    def __init__(self):
        self.item = db.users.find_one()

        if not self.item:
            self.create()

    def __repr__(self) -> str:
        self._print()
        return ""

    def _print(self):
        pprint(self.item)

    def refresh(self):
        return db.users.find_one()

    def create(self):
        self.delete()
        user_item = {
            "name": NAME,
            "email": EMAIL,
            "income": {
                "types": INCOME_TYPES,
                "sources": INCOME_SOURCES,
                "deductions": INCOME_DEDUCTIONS,
            },
            "expense": {
                "types": EXPENSE_TYPES,
                "vendors": EXPENSE_VENDORS,
            },
            "asset": {
                "types": ASSET_TYPES,
            },
            "debt": {
                "types": DEBT_TYPES,
            },
        }
        db.users.insert_one(user_item)
        self.item = db.users.find_one()

    def update(self):
        db.users.update_one({"_id": self.item["_id"]}, {"$set": self.item})
        self.item = db.users.find_one()
        return self.item

    def delete(self):
        db.users.delete_one({"_id": self.item["_id"]})

    def update_setting(self, resource, setting, updated_list):
        assert_list(str, updated_list)
        self.item[resource][setting] = updated_list
        return self.update()


user = User()
