# pylint: disable=missing-function-docstring
"""prompt functions"""

from datetime import datetime, timedelta
import inquirer
from pydash import find, sort_by, map_

from api import mongo


def asset():
    _assets = sort_by(mongo.asset.get(), "name")
    questions = [
        inquirer.List(
            "asset",
            message="Select an asset",
            choices=map_(_assets, lambda asset: asset.name),
            carousel=True,
        ),
    ]
    asset_name = inquirer.prompt(questions)["asset"]
    return find(_assets, lambda asset: asset.name == asset_name)


def assets():
    _assets = sort_by(mongo.asset.get(), "name")
    questions = [
        inquirer.Checkbox(
            "assets",
            message="Select assets",
            choices=map_(_assets, lambda asset: asset.name),
            carousel=True,
        ),
    ]
    answers = inquirer.prompt(questions)["assets"]
    return map_(
        answers, lambda answer: find(_assets, lambda _asset: _asset.name == answer)
    )


def debt():
    _debts = sort_by(mongo.debt.get(), "name")
    questions = [
        inquirer.List(
            "debt",
            message="Select an debt",
            choices=map_(_debts, lambda debt: debt.name),
            carousel=True,
        ),
    ]
    debt_name = inquirer.prompt(questions)["debt"]
    return find(_debts, lambda debt: debt.name == debt_name)


def debts():
    _debts = sort_by(mongo.debt.get(), "name")
    questions = [
        inquirer.Checkbox(
            "debts",
            message="Select debts",
            choices=map_(_debts, lambda debt: debt.name),
            carousel=True,
        ),
    ]
    answers = inquirer.prompt(questions)["debts"]
    return map_(
        answers, lambda answer: find(_debts, lambda _debt: _debt.name == answer)
    )


def account():
    _accounts = sort_by(mongo.account.get(), "name")
    questions = [
        inquirer.List(
            "account",
            message="Select an account",
            choices=map_(_accounts, lambda account: account.name),
            carousel=True,
        ),
    ]
    account_name = inquirer.prompt(questions)["account"]
    return find(_accounts, lambda account: account.name == account_name)


def bill():
    _bills = sort_by(mongo.bill.get(), "name")
    questions = [
        inquirer.List(
            "bill",
            message="Select an bill",
            choices=map_(_bills, lambda bill: bill.name),
            carousel=True,
        ),
    ]
    bill_name = inquirer.prompt(questions)["bill"]
    return find(_bills, lambda bill: bill.name == bill_name)


def expense():
    end = datetime.now().replace(hour=23, minute=59, second=59)
    start = end - timedelta(days=30)

    _expenses = sort_by(mongo.expense.search(start, end), "date")
    questions = [
        inquirer.List(
            "expense",
            message="Select an expense",
            choices=map_(
                _expenses,
                lambda expense: f"{expense.date.strftime('%Y-%m-%d')} :: {expense.vendor}{f' :: {expense.description}' if expense.description else ''}",
            ),
            carousel=True,
        ),
    ]
    expense_name = inquirer.prompt(questions)["expense"]
    result = expense_name.split(" :: ")
    date_ = result[0]
    vendor = result[1]

    return find(
        _expenses,
        lambda expense: expense.date.strftime("%Y-%m-%d") == date_
        and expense.vendor == vendor,
    )
