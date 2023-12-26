# pylint: disable=wrong-import-position, wrong-import-order, unused-import
"""Dev workbench for aws"""

import os
from datetime import date, datetime, timezone
from pprint import pprint
from time import sleep

import prompts
from services import dynamo
from services.dynamo.models.account import Account
from services.dynamo.models.asset import Asset
from services.dynamo.models.bill import Bill
from services.dynamo.models.borrow import Borrow
from services.dynamo.models.debt import Debt
from services.dynamo.models.expense import Expense
from services.dynamo.models.income import Income
from services.dynamo.models.networth import Networth
from services.dynamo.models.paycheck import Paycheck
from services.dynamo.models.purchase import Purchase
from services.dynamo.models.repayment import Repayment
from services.dynamo.models.sale import Sale

ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


# def insert_all_incomes(delete=False):
#     if delete:
#         # batch delete incomes
#         with Income.batch_write() as batch:
#             for income in dynamo.income.get():
#                 batch.delete(income)

#         # batch delete paychecks
#         with Paycheck.batch_write() as batch:
#             for paycheck in dynamo.paycheck.get():
#                 batch.delete(paycheck)

#     # convert/insert mongo incomes in dynamo
#     insert_incomes = []
#     insert_paychecks = []
#     for income in mongo.income.get():
#         if income.type == "paycheck":
#             insert_paychecks.append(
#                 Paycheck(
#                     user_id=USER_ID,
#                     paycheck_id=f"paycheck:{uuid4()}",
#                     date=income.date,
#                     employer=income.source,
#                     take_home=income.amount,
#                     taxes=income.deductions.get("tax", 0),
#                     retirement=income.deductions.get("401k", 0),
#                     benefits=income.deductions.get("benefits", 0),
#                     other=income.deductions.get("other", 0),
#                     description=description,
#                 )
#             )

#         else:
#             description = income.description

#             if income.source == "The Ohio State University":
#                 description = "Rachel's paycheck"

#             insert_incomes.append(
#                 Income(
#                     user_id=USER_ID,
#                     income_id=f"income:{uuid4()}",
#                     date=income.date,
#                     amount=income.amount,
#                     source=income.source,
#                     description=description,
#                 )
#             )

#     # batch insert incomes
#     with Income.batch_write() as batch:
#         for income in insert_incomes:
#             batch.save(income)

#     # batch insert paychecks
#     with Paycheck.batch_write() as batch:
#         for paycheck in insert_paychecks:
#             batch.save(paycheck)

def batch_delete_all():
    for Model in [
        Account,
        Asset,
        Bill,
        Borrow,
        Debt,
        Expense,
        Income,
        Networth,
        Paycheck,
        Purchase,
        Repayment,
        Sale,
    ]:
        with Model.batch_write() as batch:
            items = list(Model.scan())
            print(f"Deleting {len(items)} items from table: {Model.__name__}")

            for item in items:
                batch.delete(item)

        sleep(5)


def main():
    pass
