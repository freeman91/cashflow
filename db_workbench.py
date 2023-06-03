# pylint: disable=import-error, unused-import, wrong-import-position, missing-function-docstring, unused-variable, invalid-name
"""workbench"""

import os
import csv
import calendar
from datetime import datetime, timedelta, date
from pprint import pprint
from statistics import mean

import requests
from yahoo_fin import stock_info
from dateutil.relativedelta import relativedelta
from pydash import (
    uniq_by,
    reduce_,
    filter_,
    map_,
    find,
    remove,
    concat,
    group_by,
    sort_by,
)

from api.helpers.cron import decode_cron_rule, is_cron_match
from api.controllers.__util__ import set_last_update
from api.mongo.models.Account import Account
from api.mongo.models.Bill import Bill
from api.mongo.models.Expense import Expense
from api.mongo.models.Asset import Asset
from api.mongo.models.Debt import Debt
from api.mongo.connection import database

from api import mongo
import prompts


def get_expenses_by_type(start, stop, _type):
    expenses = sort_by(
        filter_(
            mongo.expense.search(start, stop), lambda expense: expense.type == _type
        ),
        "amount",
    )

    total = reduce_(expenses, lambda acc, expense: acc + expense.amount, 0)
    print(f"{total = }")
    return expenses


def get_year_expenses():
    # get all expenses for 2022
    # group by expense type
    expenses = group_by(
        mongo.expense.search(datetime(2022, 1, 1, 0), datetime(2022, 12, 31, 23, 59)),
        "type",
    )

    for key in sort_by(expenses.keys()):
        total = reduce_(expenses[key], lambda acc, expense: acc + expense.amount, 0)
        print(f"{key}: {total}")


def reduce_paychecks(acc, paycheck):
    return {
        "take_home": acc["take_home"] + paycheck.amount,
        "401k": acc["401k"] + paycheck.deductions["401k"],
        "benefits": acc["benefits"] + paycheck.deductions["benefits"],
        "other": acc["other"] + paycheck.deductions["other"],
        "tax": acc["tax"] + paycheck.deductions["tax"],
    }


def get_year_incomes():
    # get all incomes for 2022
    # group by income type
    incomes = mongo.income.search(
        datetime(2022, 1, 1, 0), datetime(2022, 12, 31, 23, 59)
    )
    paychecks = remove(incomes, lambda income: income.type == "paycheck")
    print("paychecks: ", end="")
    pprint(
        reduce_(
            paychecks,
            reduce_paychecks,
            {"take_home": 0, "401k": 0, "benefits": 0, "other": 0, "tax": 0},
        )
    )
    print()

    rest = group_by(incomes, "type")
    for key, values in rest.items():
        total = reduce_(values, lambda acc, income: acc + income.amount, 0)
        print(f"{key}: {total}")
        for value in values:
            print(f"\t{value.amount}: {value.source}: {value.description}")


def print_expenses(expenses):
    for expense in expenses:
        print(f"\t{expense.amount}: {expense.vendor}: {expense.description}")


def sum_expenses_by_types(start, stop, types):
    expenses = filter_(
        mongo.expense.search(start, stop), lambda expense: expense.type in types
    )

    total = reduce_(expenses, lambda acc, expense: acc + expense.amount, 0)
    print(f"{total = }")


def print_expenses_by_type(_type):
    start = datetime(2022, 1, 1, 0)
    stop = datetime(2022, 12, 31, 23, 59)
    expenses = get_expenses_by_type(start, stop, _type)
    print_expenses(expenses)
    return expenses


def compile_expenses():
    start = datetime(2022, 1, 1, 0)
    stop = datetime(2022, 12, 31, 23, 59)
    sum_expenses_by_types(
        start,
        stop,
        [
            "mortgage",
            # "utility"
            # "bike",
            # "electronics",
            # "entertainment",
            # "parking",
            # "financial",
            # "vacation",
            # "renovations",
            # "wood",
            # "other",
        ],
    )


def exp_sum_by_type():
    start = datetime(2022, 1, 1, 0)
    end = datetime(2022, 12, 31, 23, 59)
    grouped_expenses = group_by(
        mongo.expense.search(start, end),
        "type",
    )

    for _type in sort_by(grouped_expenses.keys()):
        expenses = grouped_expenses[_type]
        print(
            f"{_type}: {round(reduce_(expenses, lambda acc, expense: acc + expense.amount, 0), 2)}"
        )


def get_vendor_expenses(vendor):
    start = datetime(2022, 1, 1, 0)
    end = datetime(2022, 12, 31, 23, 59)
    all_expenses = mongo.expense.search(start, end)
    expenses = filter_(all_expenses, lambda expense: expense.vendor == vendor)

    for expense in expenses:
        print(f"{expense.vendor}: {expense.amount}")

    total = reduce_(expenses, lambda acc, expense: acc + expense.amount, 0)
    print(f"Total: {round(total, 2)}")
    print(f"Average: {round(total / 12, 2)}")


def test():
    pass


if __name__ == "__main__":
    pass
