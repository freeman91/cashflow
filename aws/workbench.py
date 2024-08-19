# pylint: disable=wrong-import-position, wrong-import-order, unused-import
"""Dev workbench for aws"""

import os
from datetime import date, datetime, timezone
from pprint import pprint
from time import sleep
from uuid import uuid4

import inquirer
from pydash import find, get, map_, uniq, sort_by, filter_
from yahoo_fin import stock_info

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
from services.api.controllers.cronjobs import get_stock_price


ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


def test():
    pass


def main():
    pass
