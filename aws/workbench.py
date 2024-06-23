# pylint: disable=wrong-import-position, wrong-import-order, unused-import
"""Dev workbench for aws"""

import os
from datetime import date, datetime, timezone
from pprint import pprint
from time import sleep
from uuid import uuid4

import inquirer
from pydash import find, map_, uniq, sort_by, filter_

# import plaid
# from plaid.api import plaid_api
# from plaid.model.liabilities_get_request import LiabilitiesGetRequest
# from plaid.model.transactions_get_request import TransactionsGetRequest
# from plaid.model.accounts_balance_get_request import AccountsBalanceGetRequest

import prompts
from services import dynamo
from services.dynamo.models.account import Account
from services.dynamo.models.asset import Asset
from services.dynamo.models.bill import Bill
from services.dynamo.models.borrow import Borrow
from services.dynamo.models.debt import Debt
from services.dynamo.models.expense import Expense
from services.dynamo.models.income import Income
from services.dynamo.models.networth import Networth, AssetMap, DebtMap
from services.dynamo.models.paycheck import Paycheck
from services.dynamo.models.purchase import Purchase
from services.dynamo.models.repayment import Repayment
from services.dynamo.models.sale import Sale


ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")

PLAID_CLIENT_ID = os.getenv("PLAID_CLIENT_ID")
PLAID_SECRET = os.getenv("PLAID_SECRET")
HNB_ACCESS_TOKEN = os.getenv("HNB_ACCESS_TOKEN")
ALLY_ACCESS_TOKEN = os.getenv("ALLY_ACCESS_TOKEN")


def update_categories():
    cats = dynamo.categories.get(user_id=USER_ID, category_type="expense")
    # cats.categories = OPTIONS
    cats.save()


# def plaid_get_account_balances():
#     configuration = plaid.Configuration(
#         host=plaid.Environment.Development,
#         api_key={
#             "clientId": PLAID_CLIENT_ID,
#             "secret": PLAID_SECRET,
#         },
#     )
#     api_client = plaid.ApiClient(configuration)
#     client = plaid_api.PlaidApi(api_client)

#     request = AccountsBalanceGetRequest(access_token=HNB_ACCESS_TOKEN)
#     response = client.accounts_balance_get(request)
#     accounts = response["accounts"]
#     pprint(accounts)


def print_paychecks():
    start = datetime(2020, 1, 1, tzinfo=timezone.utc)
    end = datetime(2024, 6, 30, tzinfo=timezone.utc)

    paychecks = dynamo.paycheck.search(user_id=USER_ID, start=start, end=end)
    paychecks = sort_by(paychecks, ["date"])
    for paycheck in paychecks:
        if not paycheck.benefits:
            pprint(
                {
                    "date": paycheck.date,
                    "take_home": paycheck.take_home,
                    "benefits": paycheck.benefits,
                }
            )


def main():
    pass


# Grey Green: #1B998B
# Dark Green: #676F54, #042A2B
# Black Green: #25291C
# Black: #12130F
# Jet: #303036
# Van Dyke: #4B3B40
# Mint: #40C9A2
