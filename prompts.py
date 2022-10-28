# pylint: disable=missing-function-docstring
"""prompt functions"""

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
