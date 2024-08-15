# pylint: disable=wrong-import-position, wrong-import-order, unused-import
"""Dev workbench for aws"""

import os
from datetime import date, datetime, timezone
from pprint import pprint
from time import sleep
from uuid import uuid4

import inquirer
from pydash import find, get, map_, uniq, sort_by, filter_

import prompts
from services import dynamo
from services.dynamo import (
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
    User,
)
from services.dynamo.networth import DebtMap, AssetMap


ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


def print_paychecks():
    start = datetime(2020, 1, 1, tzinfo=timezone.utc)
    end = datetime(2024, 6, 30, tzinfo=timezone.utc)

    paychecks = Paycheck.search(user_id=USER_ID, start=start, end=end)
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


def test():
    from yahoo_fin import stock_info

    return stock_info.get_live_price("FXAIX")


def main():
    pass
