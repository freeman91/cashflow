import csv, sys
from datetime import datetime
from io import StringIO
from fabric import Connection
from pprint import pprint

from db_workbench import Assets, Debts, Expenses, Incomes, Hours, Networths


def migrate_expenses():
    Expenses.delete_all()
    expenses = Connection("192.168.0.42").run(
        "cat repos/cashflow-api/seed/expenses.csv", hide=True
    )
    f = StringIO(expenses.stdout)
    reader = csv.reader(f, delimiter="|")

    expenses_inserted = 0
    for idx, row in enumerate(reader):
        if idx == 0:
            continue

        amount = float(row[0].strip())
        _type = row[1].strip().lower()
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
    f = StringIO(incomes.stdout + other_incomes.stdout)
    reader = csv.reader(f, delimiter="|")
    incomes_inserted = 0
    for idx, row in enumerate(reader):
        if idx == 0:
            continue
        amount = float(row[0].strip())
        _type = row[1].strip().lower()
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
    f = StringIO(hours.stdout)
    reader = csv.reader(f, delimiter="|")
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
    networths = Connection("192.168.0.42").run(
        "cat repos/cashflow-api/seed/networths.csv", hide=True
    )
    f = StringIO(networths.stdout)
    reader = csv.reader(f, delimiter="|")
    current_month = 0
    current_year = 0
    current_date = ""
    count = -1
    records = []

    for idx, row in enumerate(reader):
        if idx == 0:
            continue

        r0 = row[0]
        r1 = row[1]

        if r0.isnumeric() and r1.isnumeric():
            current_year = int(r0)
            current_month = int(r1)
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
            _type = row[2].lower()
            name = row[3].lower()

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


def generate_assets():
    Assets.delete_all()
    assets = [
        {
            "name": "cash",
            "value": float(500),
            "type": "cash",
            "description": "",
        },
        {
            "name": "Huntington",
            "value": 786.94,
            "type": "checking",
            "description": "",
        },
        {
            "name": "ally",
            "value": 6336.05,
            "type": "savings",
            "description": "",
        },
        {
            "name": "owed",
            "value": float(900),
            "type": "cash",
            "description": "Matt's rent",
        },
        {
            "name": "chevy malibu",
            "value": float(4000),
            "type": "vehicle",
            "description": "",
        },
        # crypto
        {
            "name": "ether",
            "value": 2016.13,
            "type": "crypto",
            "shares": 0.90255766,
            "price": 2233.79,
            "ticker": "eth",
            "description": "",
        },
        {
            "name": "bitcoin",
            "value": float(1895.11),
            "type": "crypto",
            "shares": 0.05584705,
            "price": 2234.29,
            "ticker": "btc",
            "description": "",
        },
        {
            "name": "chainlink",
            "value": float(293.31),
            "type": "crypto",
            "shares": 15.56136155,
            "price": 18.83,
            "ticker": "link",
            "description": "",
        },
        # stoncks
        {
            "name": "vanguard total world etf",
            "value": 103.9,
            "type": "stock",
            "shares": 1.05,
            "price": 103.90,
            "invested": 100.0,
            "ticker": "vt",
            "description": "",
        },
        {
            "name": "agenus",
            "value": 5.44,
            "type": "stock",
            "shares": 1.0,
            "price": 5.44,
            "invested": 0.0,
            "ticker": "agen",
            "description": "free robinhood stock",
        },
        {
            "name": "vanguard info tech",
            "value": 71.0,
            "type": "stock",
            "shares": 0.174996,
            "price": 405.71,
            "invested": 61.69,
            "ticker": "vgt",
            "description": "",
        },
        {
            "name": "vanguard high dividend",
            "value": 109.97,
            "type": "stock",
            "shares": 1.057287,
            "price": 104.01,
            "invested": 101.47,
            "ticker": "vym",
            "description": "",
        },
        {
            "name": "apple",
            "value": 284.39,
            "type": "stock",
            "shares": 2.003483,
            "price": 141.95,
            "invested": 242.26,
            "ticker": "aapl",
            "description": "",
        },
        {
            "name": "global cannabis",
            "value": 130.8,
            "type": "stock",
            "shares": 10.0,
            "price": 13.08,
            "invested": 191.0,
            "ticker": "potx",
            "description": "",
        },
        {
            "name": "sundial growers",
            "value": 89.5,
            "type": "stock",
            "shares": 100.0,
            "price": 0.895,
            "invested": 160.0,
            "ticker": "sndl",
            "description": "",
        },
        {
            "name": "mind medicine",
            "value": 152.76,
            "type": "stock",
            "shares": 44.928888,
            "price": 3.4,
            "invested": 202.18,
            "ticker": "mnmd",
            "description": "",
        },
        {
            "name": "tilray",
            "value": 217.1,
            "type": "stock",
            "shares": 13.0,
            "price": 16.7,
            "invested": 267.0,
            "ticker": "tlry",
            "description": "",
        },
        {
            "name": "clean energy portfolio",
            "value": 333.76,
            "type": "stock",
            "shares": 3.713832,
            "price": 89.87,
            "invested": 328.79,
            "ticker": "pbw",
            "description": "",
        },
        {
            "name": "powershares",
            "value": 206.11,
            "type": "stock",
            "shares": 0.572778,
            "price": 359.85,
            "invested": 200.0,
            "ticker": "qqq",
            "description": "",
        },
    ]

    for asset in assets:
        Assets.create(asset)


def generate_debts():
    Debts.delete_all()
    debts = [
        {
            "name": "huntington",
            "value": float(150),
            "type": "credit",
            "description": "",
        },
        {
            "name": "great lakes",
            "value": float(29000),
            "type": "tuition",
            "description": "",
        },
    ]

    for debt in debts:
        Debts.create(debt)


def migrate_all():
    migrate_expenses()
    migrate_incomes()
    migrate_hours()
    # migrate_networths()
    # generate_assets()
    # generate_debts()


if __name__ == "__main__":
    globals()[sys.argv[1]]()
