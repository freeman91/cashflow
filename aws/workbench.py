# pylint: disable=wrong-import-position, wrong-import-order, unused-import
"""Dev workbench for aws"""

import os
import json
from datetime import date, datetime, timedelta, timezone
from pprint import pprint
from time import sleep
from uuid import uuid4

import inquirer
from pydash import (
    find,
    get,
    map_,
    uniq,
    sort_by,
    filter_,
    remove,
    reduce_,
    head,
    find_index,
)
from yahoo_fin import stock_info

import prompts
from services import dynamo
from services.dynamo import (
    Account,
    Asset,
    Bill,
    Borrow,
    Budget,
    Debt,
    Expense,
    History,
    Income,
    Networth,
    Paycheck,
    Purchase,
    Repayment,
    Sale,
    Security,
    User,
    OptionList,
)
from services.dynamo.history import ValueItem


ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


def backup_items():
    for type_, Model in [
        ("account", Account),
        ("asset", Asset),
        ("bill", Bill),
        ("borrow", Borrow),
        ("debt", Debt),
        ("expense", Expense),
        ("income", Income),
        ("networth", Networth),
        ("paycheck", Paycheck),
        ("purchase", Purchase),
        ("repayment", Repayment),
        ("sale", Sale),
    ]:
        print(type_)

        # overwrite or create file
        if os.path.exists(f"backups/{type_}.json"):
            os.remove(f"backups/{type_}.json")

        # write all accounts to file
        with open(f"backups/{type_}.json", "w", encoding="utf-8") as f:
            f.write("[")

            for item in Model.list():
                f.write(json.dumps(item.as_dict()))
                f.write(",\n")

            f.write("]")


def find_item_id(id_: str):
    if id_ in asset_to_account:
        return asset_to_account[id_]
    if id_ in debt_id_map:
        return debt_id_map[id_]
    if id_ in asset_to_account_security:
        return asset_to_account_security[id_]["security_id"]
    if id_ in asset_id_to_item_id:
        return asset_id_to_item_id[id_]
    if id_ in debt_id_to_item_id:
        return debt_id_to_item_id[id_]
    return None


def update_or_create_history(item_id: str, account_type: str, value_item: dict):
    history = History.get_(item_id, "2025-01")
    if history:
        idx = find_index(history.values, lambda v: v["date"] == value_item["date"])
        if idx > -1:
            history.values[idx] = value_item
        else:
            history.values.append(value_item)

        history.values = sort_by(history.values, "date")
        for value in history.values:
            print(value.as_dict(), end=", ")
        print()
        history.save()

    else:
        print("CREATE")
        # History.create(
        #     item_id, "2025-01", account_type, USER_ID, [value_item]
        # )


def test():
    with open("backups/networth.json", "r", encoding="utf-8") as f:
        networths = json.load(f)

    jan_2025_nw = find(networths, lambda nw: nw["month"] == 1 and nw["year"] == 2025)
    assets = jan_2025_nw["assets"]
    debts = jan_2025_nw["debts"]

    for asset in assets:
        item_id = find_item_id(asset["asset_id"])
        update_or_create_history(
            item_id,
            "asset",
            ValueItem(date="2025-01-01", value=asset["value"]),
        )

    for debt in debts:
        item_id = find_item_id(debt["debt_id"])
        update_or_create_history(
            item_id,
            "liabaility",
            ValueItem(date="2025-01-01", value=debt["value"]),
        )


def main():
    pass


asset_to_account = {
    "asset:8c4a7955-7fdb-465b-a3bc-c4207b2151ea": "account:4d51ff4b-0f75-4b6f-aba0-2e026d5c1c59",
    "asset:aada4bb1-8151-408d-a998-9f4bd75c0a20": "account:3c4e3b28-26cd-43ef-865e-03282e259340",
    "asset:df7ea372-a391-4d2e-b16a-87880ee8142a": "account:7ec938f9-ba4c-4de5-8a99-351e003a6f3c",
    "asset:da8464e3-4880-423d-878f-66572e514a6d": "account:9fe0c028-3cc7-4a97-8ad4-4fe037914054",
    "asset:60ec9101-9b9d-4697-974c-72df47d54001": "account:d3139e73-571a-4604-91f1-50eefa2e3e8a",
    "asset:1007222a-e4b4-40d2-8362-c551ffef1d49": "account:08e482b4-1cb4-4051-9513-51f5e7565ff2",
}

asset_to_account_security = {
    "asset:b56aa048-571f-47b3-bb15-df095dc4c2cb": {  # SPY
        "account_id": "account:753d020b-f942-4f44-93a4-74d5172f21f8",
        "security_id": "security:671f11de-cfdb-4be5-8d8c-1730e3e068cd",
    },
    "asset:0482915e-26c8-4aed-b5ff-3a4c4b520502": {  # VTI
        "account_id": "account:753d020b-f942-4f44-93a4-74d5172f21f8",
        "security_id": "security:ef865e71-d60e-4940-b0dc-6b60422ea921",
    },
    "asset:210dcb1c-7b32-4efb-ba5b-6cf9668fed85": {  # ETH
        "account_id": "account:dcc39378-ca56-4114-813e-6d6527e43ad8",
        "security_id": "security:98f2f58c-1586-45b4-ac0b-3d019b6d4080",
    },
    "asset:db9a9d1c-832e-40cf-8ef5-03a8b14e2fda": {  # BTC
        "account_id": "account:dcc39378-ca56-4114-813e-6d6527e43ad8",
        "security_id": "security:db1c13f5-e798-4b11-a89d-7756dfdd3974",
    },
    "asset:5200de46-c10d-4144-bcef-b93679ec7a8b": {  # FZROX 23.697
        "account_id": "account:65bb155c-ee40-4794-bc55-8201b1983861",
        "security_id": "security:7be57c07-37e0-4954-9b39-79182baf3665",
    },
    "asset:a9b01adf-e8cf-445e-b37a-e9ba70563917": {  # ADA
        "account_id": "account:dcc39378-ca56-4114-813e-6d6527e43ad8",
        "security_id": "security:cca3a6ba-e32a-42ee-abce-6b9f67d62a17",
    },
    "asset:3eda1406-a693-4f57-8aa1-9e3a5009f52b": {  # FZROX 96.04
        "account_id": "account:1a694972-4a3f-42e0-a74c-e5eed795377b",
        "security_id": "security:a8d6c770-8877-4969-9f30-d424f176349b",
    },
    "asset:c8f4b89b-cfa3-4fa2-a435-f5472a276b69": {  # FXAIX
        "security_id": "security:e5b4cf2e-9f68-40ac-8217-3b08bc00367c",
    },
    "asset:dd183dc2-56b9-4887-bc86-ae922e213aad": {  # ADT
        "security_id": "security:bb4221bf-75b5-4f53-bf45-9c060c7439df",
    },
}

debt_id_map = {
    "debt:1760592b-7a16-4288-a19d-baf4a39b2404": "account:b47a1d48-464d-422e-85f8-5d3421b7be90",
    "debt:ec77c8f3-6c95-4b35-8856-67a67e60be8a": "account:941e73ce-c5b7-4ba7-b743-ee12a2927463",
    "debt:f1a94e4d-fb23-4e6d-8670-088d6890ab84": "account:e9cb1aca-2efd-431d-a723-720d27b1fcd8",
    "debt:3719dc0f-5c50-49a3-85da-06006b5d6cdc": "account:0ca1f388-1926-45b6-99cf-9bc6e531ff81",
    "debt:5489290d-4a4c-4fb0-8b41-41a2932a717c": "account:543bdb31-a00d-44c2-b255-b9d8bddfa951",
    "debt:52f56848-6091-4486-9e21-ca8a367b998b": "account:a2ca67b3-c851-4323-aa16-0eb789b2c62a",
    "debt:4fd5d87c-49a8-4d83-a69d-9897aca28df2": "account:e1d19728-c67b-4996-9caf-6a22c5235311",
    "debt:eee7a53c-fc1a-4f86-9bb2-440d14f1d0a4": "account:f86b0c91-a5cc-4008-9f0f-0420c5e0043a",
    "debt:2ef6a3a3-d87b-4d7a-b52a-bc7150d2be7a": "account:ad347de8-b925-4113-a961-b204b6e61a1e",
}

asset_id_to_item_id = {
    "asset:betterment-stocks": "security:betterment-stocks",
    "asset:blockfi-cash": "security:blockfi-cash",
    "asset:blockfi-crypto": "security:blockfi-crypto",
    "asset:blockfi-link": "security:blockfi-link",
    "asset:blockfi-ltc": "security:blockfi-ltc",
    "asset:blockfi-sol": "security:blockfi-sol",
    "asset:chevy-malibu": "security:chevy-malibu",
    "asset:none": "account:7ec938f9-ba4c-4de5-8a99-351e003a6f3c",
    "asset:owed": "account:9f8eaed2-b3b7-4792-b0e6-bfdde0b85a9b",
    "asset:robinhood": "security:robinhood",
    "asset:uphold-bat": "security:uphold-bat",
    "asset:webull-qqq": "security:webull-qqq",
    "asset:webull-stocks": "security:webull-stocks",
}

debt_id_to_item_id = {
    "debt:all-inclusive-outlet-jamaica": "account:all-inclusive-outlet-jamaica",
    "debt:none": "account:b47a1d48-464d-422e-85f8-5d3421b7be90",
}
