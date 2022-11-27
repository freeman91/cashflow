# pylint: disable=import-error, unused-import, wrong-import-position, missing-function-docstring, unused-variable, invalid-name
"""workbench"""

import os
import requests
from pprint import pprint
from datetime import datetime, timedelta, date
import inquirer
from ofxtools import OFXClient
from ofxtools.scripts import ofxget

from yahoo_fin import stock_info
from pydash import uniq_by, reduce_, filter_, map_, find, remove, mean, concat

from api.controllers.__util__ import set_last_update
from api.mongo.models.Account import Account
from api.mongo.models.Expense import Expense
from api.mongo.models.Asset import Asset
from api.mongo.models.Debt import Debt
from api.mongo.connection import database

from api import mongo
import prompts


def ofx():
    client = OFXClient(
        "https://ofx.huntington.com/Ofx/process.ofx",
        userid="AEFreeman1",
        org="huntington",
        fid="3701",
        version=220,
        prettyprint=True,
        bankid=None,
    )
    print(f"{client = }")
    a0 = ofxget.AcctInfo(acctid="1", accttype="CHECKING")
    print(a0)


def create_bill(
    name="Natural Gas",
    amount=50,
    type_="utility",
    vendor="Columbia Gas",
    description="gas",
):
    bill = mongo.bill.create(
        {
            "name": name,
            "amount": amount,
            "type": type_,
            "vendor": vendor,
            "description": description,
            "rule": [
                [31],
                [28],
                [31],
                [30],
                [31],
                [30],
                [31],
                [31],
                [30],
                [31],
                [30],
                [31],
            ],
        }
    )
    print(bill)


def test_cronjob():
    res = requests.get("http://localhost:9000/cronjobs/generate_bill_expenses")
    pprint(res.json())


def find_expenses():
    expenses = filter_(
        mongo.expense.get(),
        lambda expense: expense.vendor == "Columbia Gas",
    )

    return expenses


def test():
    pass


if __name__ == "__main__":
    pass
