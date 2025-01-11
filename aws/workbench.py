# pylint: disable=wrong-import-position, wrong-import-order, unused-import
"""Dev workbench for aws"""

import os
import json
import calendar
from datetime import date, datetime, timedelta, timezone
from pprint import pprint
from time import sleep
from uuid import uuid4

import inquirer
from pydash import (
    find,
    group_by,
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
    Recurring,
    Repayment,
    Sale,
    Security,
    User,
    OptionList,
)
from services.dynamo import ExpenseAttributes, RepaymentAttributes, PaycheckAttributes
from services.dynamo.history import ValueItem


ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


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


def find_recurring_attrs(bill):
    active = True
    frequency = None
    interval = 1
    day_of_month = None
    month_of_year = None

    if len(bill.months) == 0:
        active = False
        frequency = "monthly"
        day_of_month = bill.day

    elif len(bill.months) == 1:
        frequency = "yearly"
        month_of_year = bill.months[0]
        day_of_month = bill.day

    elif len(bill.months) == 4:
        frequency = "monthly"
        interval = 4

    elif len(bill.months) == 3:
        frequency = "weekly"
        interval = 15

    elif len(bill.months) == 12:
        frequency = "monthly"
        day_of_month = bill.day

    return active, frequency, interval, month_of_year, day_of_month


# def migrate_bills():
#     bill_id_recurring_id = {}
#     for bill in Bill.list():
#         active, frequency, interval, month_of_year, day_of_month = find_recurring_attrs(
#             bill
#         )

#         print(f"Migrating bill {bill.name} :: {bill.day} :: {len(bill.months)}")

#         if bill.account_id:
#             # generate recurring repayment
#             recurring = Recurring(
#                 recurring_id=f"recurring:{uuid4()}",
#                 active=active,
#                 user_id=bill.user_id,
#                 item_type="repayment",
#                 name=bill.name,
#                 frequency=frequency,
#                 interval=interval,
#                 month_of_year=month_of_year,
#                 day_of_month=day_of_month,
#                 repayment_attributes=RepaymentAttributes(
#                     amount=bill.amount,
#                     escrow=bill.escrow,
#                     merchant=bill.merchant,
#                     category=bill.category,
#                     subcategory=bill.subcategory,
#                     account_id=bill.account_id,
#                     payment_from_id=bill.payment_from_id,
#                 ),
#             )
#         else:
#             # generate recurring expense
#             recurring = Recurring(
#                 recurring_id=f"recurring:{uuid4()}",
#                 active=active,
#                 user_id=bill.user_id,
#                 item_type="expense",
#                 name=bill.name,
#                 frequency=frequency,
#                 interval=interval,
#                 month_of_year=month_of_year,
#                 day_of_month=day_of_month,
#                 expense_attributes=ExpenseAttributes(
#                     amount=bill.amount,
#                     merchant=bill.merchant,
#                     category=bill.category,
#                     subcategory=bill.subcategory,
#                     payment_from_id=bill.payment_from_id,
#                 ),
#             )

#         recurring.save()
#         bill_id_recurring_id[bill.bill_id] = recurring.recurring_id

#     pprint(bill_id_recurring_id)


# def migrate_paycheck_templates():
#     all_paychecks = Paycheck.list()
#     templates = filter_(all_paychecks, lambda p: "template" in p.paycheck_id)
#     for paycheck in templates:
#         recurring = Recurring(
#             active=True,
#             recurring_id=f"recurring:{uuid4()}",
#             user_id=paycheck.user_id,
#             item_type="paycheck",
#             name=f"{paycheck.employer} paycheck",
#             frequency="weekly",
#             interval=2,
#             day_of_week=5,
#             paycheck_attributes=PaycheckAttributes(
#                 employer=paycheck.employer,
#                 take_home=paycheck.take_home,
#                 taxes=paycheck.taxes,
#                 retirement_contribution=paycheck.retirement_contribution,
#                 benefits_contribution=paycheck.benefits_contribution,
#                 other_benefits=paycheck.other_benefits,
#                 other=paycheck.other,
#                 deposit_to_id=paycheck.deposit_to_id,
#             ),
#         )
#         pprint(recurring.as_dict())
#         recurring.save()


# def add_expense_repayment_recurring_id():
#     # while Expense.batch_pu
#     expenses = list(Expense.scan(Expense.bill_id.exists()))
#     repayments = list(Repayment.scan(Repayment.bill_id.exists()))

#     with Expense.batch_write() as batch:
#         for expense in expenses:
#             if expense.bill_id and expense.bill_id in bill_to_recurring:
#                 expense.recurring_id = bill_to_recurring[expense.bill_id]
#             expense.bill_id = None
#             batch.save(expense)

#     print(f"Updated {len(expenses)} expenses")

#     with Repayment.batch_write() as batch:
#         for repayment in repayments:
#             if repayment.bill_id and repayment.bill_id in bill_to_recurring:
#                 repayment.recurring_id = bill_to_recurring[repayment.bill_id]
#             repayment.bill_id = None
#             repayment.save()

#     print(f"Updated {len(repayments)} repayments")


def test():
    pass


def main():
    pass


bill_to_recurring = {
    "bill:09bc9179-9b88-42b5-81d8-8c893692dadd": "recurring:45e3df4a-eda6-4d3a-a33b-cfb973e7baeb",
    "bill:09e88d03-ac90-4037-b127-18feea8c8275": "recurring:08bdce1b-4948-4583-ac93-23e946fa49ca",
    "bill:1e60c4de-12fe-407f-b9be-ffb111a41cc4": "recurring:e56fc93f-c015-475d-a606-69736dc0ab8b",
    "bill:2b19838b-1642-41e7-8792-3de7eb78808d": "recurring:f117c9a3-954c-441c-b202-e5ef171c8fb5",
    "bill:393254e0-264b-4f1a-91a5-b81fa01d02f4": "recurring:28704eac-4b13-4f88-8fbe-69f30930d910",
    "bill:3bd24338-3ed4-457e-827a-617d4a741edf": "recurring:738d97f7-f900-4c6b-a6fb-e5c63f30fb00",
    "bill:3de9966d-3ca6-4cac-b607-bdd2a5a773ee": "recurring:07bded37-f94b-4717-8ffc-6e1674e10304",
    "bill:419a59ba-badc-49f1-96b5-2ba38ea320aa": "recurring:96d1a341-4522-4b04-89a2-6f99949b8c5d",
    "bill:487d9ecc-edaf-4f15-af22-e25754adee8d": "recurring:7e7d4799-eb95-4a8e-b287-6f6f4c0a7a9c",
    "bill:5a68bd76-5d99-4046-82c0-e143bf655a18": "recurring:ece95e14-9295-426a-a673-17d8f3522505",
    "bill:60f87407-1ee5-47f0-b253-f112d76c93a5": "recurring:07430170-3c9d-4fc3-b3cf-230cd4c123fa",
    "bill:9c4359b5-fb0f-47f6-8811-4eb8a7090116": "recurring:42be9bf2-0797-4956-8c4e-b91d4c9283f7",
    "bill:a82abae2-0327-4634-ac57-a0e71939dfc3": "recurring:482981d0-9cde-4426-aec3-d68a7b2be516",
    "bill:bdac1b68-e403-43b3-b751-2159b6762c29": "recurring:0696b4c5-0a3f-427a-a9e8-8200aeafe022",
    "bill:d73da1e5-ca75-4154-97fb-098db53d4bb8": "recurring:1030ed79-5b50-4abd-b7db-5810d62cff00",
    "bill:d828bee1-8cbc-4aba-9327-15a00643e395": "recurring:25c47d4a-0bce-497b-b750-70da2bfc85cd",
    "bill:db25a7ba-c359-4bd1-9a39-7183dc27b4d7": "recurring:804bbd77-512d-4429-bfe7-f395bac36940",
    "bill:dce4db49-840a-42b7-a939-cc4be07474ee": "recurring:90dc96b3-b84f-412d-87c4-6edae022fb7e",
    "bill:e1f16ffa-8eff-4983-988e-20fb166716d0": "recurring:ec0d0b6e-b684-45d2-9cb8-ea4745240073",
    "bill:e3763164-4cf8-400e-b02d-2d6c61d1a46f": "recurring:ebef97c9-26ba-4958-b36d-a093b7391102",
    "bill:f74f87b9-c467-469b-a1dd-853fe5fef73b": "recurring:ca19c27a-dfa8-4c8b-9c6a-1805ce70d410",
}

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
