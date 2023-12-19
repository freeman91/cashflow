# pylint: disable=import-error, unused-import, wrong-import-position, missing-function-docstring, unused-variable, invalid-name, cell-var-from-loop
"""workbench"""

import os
import csv
import calendar
from datetime import datetime, timedelta, date
from pprint import pprint
from statistics import mean

import requests
from yahoo_fin import stock_info
from pydash import reduce_, filter_, find, remove, sort_by, group_by, range_

from api.helpers.cron import decode_cron_rule, is_cron_match
from api.controllers.__util__ import set_last_update
from api.controllers.cronjobs import get_stock_price

os.environ["WB_DOMAIN"] = "localhost"
os.environ["WB_PORT"] = "27017"

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


def create_bill_expenses():
    new_expenses = []
    bills = mongo.bill.get()

    _date = date(2024, 1, 1)
    for _ in range_(31):
        for bill in bills:
            if is_cron_match(bill.rule, _date):
                bill_expense = find(
                    mongo.expense.get(),
                    lambda expense: expense.type == bill.type
                    and expense.vendor == bill.vendor
                    and expense.date.date() == _date,
                )

                if not bill_expense:
                    new_expense = {
                        "amount": bill.amount,
                        "date": datetime(_date.year, _date.month, _date.day, 12, 0),
                        "type": bill.type,
                        "vendor": bill.vendor,
                        "description": bill.description,
                        "paid": False,
                        "bill_id": bill.id,
                    }
                    new_expenses.append(new_expense)

        _date += timedelta(days=1)

    for expense in new_expenses:
        print(expense)
        mongo.expense.create(expense)


def process_exps():
    expenses = mongo.expense.search(
        datetime(2022, 1, 1, 0), datetime(2023, 8, 31, 0, 0)
    )
    expenses = [exp.__dict__ for exp in expenses]
    with open("expenses.csv", mode="w", newline="", encoding="utf-8") as file:
        writer = csv.DictWriter(file, fieldnames=expenses[0].keys())

        # Write header row
        writer.writeheader()

        # Write data rows
        writer.writerows(expenses)


def test():
    pass


if __name__ == "__main__":
    pass
