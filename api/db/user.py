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

    def create(self):
        self.delete()
        user_item = {
            "name": NAME,
            "email": EMAIL,
            "networth": 0,
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

    def update_networth(self, networth: float):
        assert type(networth) in [float, int]
        self.item["networth"] = networth
        return self.update()

    def update_income(self, attr: str, l: list):
        assert_list(str, l)
        assert attr in self.income_attrs
        self.item["income"][attr] = l
        return self.update()

    def update_expense(self, attr: str, l: list):
        assert_list(str, l)
        assert attr in self.expense_attrs
        self.item["expense"][attr] = l
        return self.update()

    def update_asset(self, attr: str, l: list):
        assert_list(str, l)
        assert attr in self.assets_attrs
        self.item["asset"][attr] = l
        self.update()

    def update_debt(self, attr: str, l: list):
        assert_list(str, l)
        assert attr in self.debts_attrs
        self.item["debt"][attr] = l
        return self.update()


user = User()
