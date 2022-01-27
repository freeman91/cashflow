# pylint: disable=missing-function-docstring
"""script to migrate data from cashflow to cashflow2"""

import sys
import csv
from datetime import datetime
from io import StringIO
from fabric import Connection

from db_workbench import Assets, Debts, Expenses, Incomes, Hours, Networths


def migrate_expenses():
    Expenses.delete_all()
    expenses = Connection("192.168.0.42").run(
        "cat repos/cashflow-api/seed/expenses.csv", hide=True
    )
    file = StringIO(expenses.stdout)
    reader = csv.reader(file, delimiter="|")

    expenses_inserted = 0
    for idx, row in enumerate(reader):
        if idx == 0:
            continue

        amount = float(row[0].strip())
        _type = row[1].strip()
        vendor = row[2].strip()
        description = row[3].strip()
        date = datetime.strptime(row[4].strip(), "%Y-%m-%d").replace(hour=12)
        new_expense = {
            "amount": amount,
            "type": _type,
            "vendor": vendor,
            "description": description,
            "date": date,
            "asset": "",
            "debt": "",
        }
        Expenses.create(new_expense)
        expenses_inserted += 1

    print(f"Expenses inserted: {expenses_inserted}")


def migrate_incomes():
    Incomes.delete_all()
    incomes = Connection("192.168.0.42").run(
        "cat repos/cashflow-api/seed/incomes.csv", hide=True
    )
    other_incomes = Connection("192.168.0.42").run(
        "cat repos/cashflow-api/seed/other_incomes.csv", hide=True
    )
    file = StringIO(incomes.stdout + other_incomes.stdout)
    reader = csv.reader(file, delimiter="|")
    incomes_inserted = 0
    for idx, row in enumerate(reader):
        if idx == 0:
            continue
        amount = float(row[0].strip())
        _type = row[1].strip()
        source = row[2].strip()
        description = row[3].strip()
        date = datetime.strptime(row[4].strip(), "%Y-%m-%d").replace(hour=12)
        new_income = {
            "amount": amount,
            "type": _type,
            "source": source,
            "deductions": {},
            "description": description,
            "date": date,
            "asset": "",
        }

        Incomes.create(new_income)
        incomes_inserted += 1

    print(f"Incomes inserted: {incomes_inserted}")


def migrate_hours():
    Hours.delete_all()
    hours = Connection("192.168.0.42").run(
        "cat repos/cashflow-api/seed/hours.csv", hide=True
    )
    file = StringIO(hours.stdout)
    reader = csv.reader(file, delimiter="|")
    hours_inserted = 0
    for idx, row in enumerate(reader):
        if idx == 0:
            continue
        amount = float(row[0].strip())
        source = row[1].strip().lower()
        description = ""
        date = datetime.strptime(row[2].strip(), "%Y-%m-%d").replace(hour=12)
        new_hour = {
            "amount": amount,
            "source": source,
            "description": description,
            "date": date,
        }

        Hours.create(new_hour)
        hours_inserted += 1

    print(f"Hours inserted: {hours_inserted}")


def migrate_networths():
    Networths.delete_all()
    networths = Connection("192.168.0.42").run(
        "cat repos/cashflow-api/seed/networths.csv", hide=True
    )
    file = StringIO(networths.stdout)
    reader = csv.reader(file, delimiter="|")
    current_month = 0
    current_year = 0
    current_date = ""
    count = -1
    records = []

    for idx, row in enumerate(reader):
        if idx == 0:
            continue

        item_0 = row[0]
        item_1 = row[1]

        if item_0.isnumeric() and item_1.isnumeric():
            current_year = int(item_0)
            current_month = int(item_1)
            current_date = row[2]
            count += 1
            records.append(
                {
                    "year": current_year,
                    "month": current_month,
                    "date": datetime.strptime(current_date.strip(), "%Y-%m-%d").replace(
                        hour=12
                    ),
                    "assets": [],
                    "debts": [],
                }
            )

        else:
            category = row[0]
            amount = float(row[1])
            _type = row[2]
            name = row[3]

            record = {
                "category": category,
                "amount": amount,
                "type": _type,
                "name": name,
            }

            if record["category"] == "asset":
                records[count]["assets"] += [record]
            elif record["category"] == "debt":
                records[count]["debts"] += [record]

    for record in records:
        Networths.create(record)

    print("Net Worths generated")


def generate_assets():
    Assets.delete_all()
    assets = [
        {
            "category": "asset",
            "description": "",
            "invested": 793.69,
            "last_update": datetime.now(),
            "name": "BTC",
            "price": 46317.09,
            "shares": 0.03698278,
            "type": "crypto",
            "value": 1712.93,
            "vendor": "BlockFi",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 5.46,
            "last_update": datetime.now(),
            "name": "ETH",
            "price": 3792.16,
            "shares": 0.85488583,
            "type": "crypto",
            "value": 3241.86,
            "vendor": "BlockFi",
        },
        {
            "category": "asset",
            "description": "",
            "invested": -175.82,
            "last_update": datetime.now(),
            "name": "LINK",
            "price": 18.23,
            "shares": 6.74103489,
            "type": "crypto",
            "value": 122.89,
            "vendor": "BlockFi",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 0.0,
            "last_update": datetime.now(),
            "name": "BAT",
            "price": 1.12,
            "shares": 22.20641,
            "type": "crypto",
            "value": 24.87,
            "vendor": "Uphold",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 200.0,
            "last_update": datetime.now(),
            "name": "VT",
            "price": 105.4,
            "shares": 2.015688,
            "type": "stock",
            "value": 212.45,
            "vendor": "robinhood",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 61.48,
            "last_update": datetime.now(),
            "name": "VGT",
            "price": 441.78,
            "shares": 0.175397,
            "type": "stock",
            "value": 77.49,
            "vendor": "robinhood",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 200.0,
            "last_update": datetime.now(),
            "name": "VYM",
            "price": 110.48,
            "shares": 2.024438,
            "type": "stock",
            "value": 223.66,
            "vendor": "robinhood",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 427.85,
            "last_update": datetime.now(),
            "name": "PBW",
            "price": 72.48,
            "shares": 4.879818,
            "type": "stock",
            "value": 353.69,
            "vendor": "robinhood",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 200.0,
            "last_update": datetime.now(),
            "name": "QQQ",
            "price": 385.69,
            "shares": 0.573399,
            "type": "stock",
            "value": 221.15,
            "vendor": "robinhood",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 0.0,
            "last_update": datetime.now(),
            "name": "Basketball League Fees",
            "price": 0.0,
            "shares": 0.0,
            "type": "owed",
            "value": 372.0,
            "vendor": "",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 5136.96,
            "last_update": datetime.now(),
            "name": "401k",
            "price": 0.0,
            "shares": 0.0,
            "type": "retirement",
            "value": 8014.05,
            "vendor": "Fidelity",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 0.0,
            "last_update": datetime.now(),
            "name": "Huntington Checking Acct",
            "price": 0.0,
            "shares": 0.0,
            "type": "checking",
            "value": 19101.75,
            "vendor": "Huntington",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 0.0,
            "last_update": datetime.now(),
            "name": "Ally Savings",
            "price": 0.0,
            "shares": 0.0,
            "type": "savings",
            "value": 1548.36,
            "vendor": "Ally",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 0.0,
            "last_update": datetime.now(),
            "name": "Chevy Malibu",
            "price": 0.0,
            "shares": 0.0,
            "type": "vehicle",
            "value": 2500.0,
            "vendor": "CarMax",
        },
        {
            "category": "asset",
            "description": "",
            "invested": 0.0,
            "last_update": datetime.now(),
            "name": "Cash",
            "price": 0.0,
            "shares": 0.0,
            "type": "cash",
            "value": 699.0,
            "vendor": "",
        },
    ]

    for asset in assets:
        Assets.create(asset)

    print("Assets generated")


def generate_debts():
    Debts.delete_all()
    debts = [
        {
            "category": "debt",
            "description": "",
            "last_update": datetime.now(),
            "name": "Student Loans",
            "type": "tuition",
            "value": 28500.0,
            "vendor": "Great Lakes",
        },
        {
            "category": "debt",
            "description": "",
            "last_update": datetime.now(),
            "name": "Huntington Credit Card",
            "type": "credit",
            "value": 1566.95,
            "vendor": "Huntington",
        },
    ]

    for debt in debts:
        Debts.create(debt)

    print("Debts generated")


def migrate_all():
    migrate_expenses()
    migrate_incomes()
    migrate_hours()
    migrate_networths()
    # generate_assets()
    # generate_debts()


if __name__ == "__main__":
    globals()[sys.argv[1]]()
