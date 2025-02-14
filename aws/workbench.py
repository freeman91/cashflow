# pylint: disable=wrong-import-position, wrong-import-order, unused-import, wildcard-import
"""Dev workbench for aws"""

import os
import json
import csv
from datetime import date, datetime, timedelta, timezone
from pprint import pprint
from uuid import uuid4
from pydash import (
    find,
    group_by,
    get,
    head,
    map_,
    uniq,
    sort_by,
    filter_,
    remove,
    reduce_,
    last,
    find_index,
)

import prompts
from services import dynamo
from services.dynamo import *

ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


def compile_hsa_expenses():
    # get all expenses from Transactions.csv
    expenses = []
    with open("Transactions.csv", "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        # skip the first row
        next(reader)
        for row in reader:
            _date = datetime.strptime(row[0], "%m/%d/%y").replace(
                hour=12, minute=0, second=0, microsecond=0
            )
            amount = row[3].replace("($", "").replace(")", "")
            expenses.append(
                {"date": _date, "merchant": row[1], "amount": float(amount)}
            )

    return expenses


def insert_hsa_expenses():
    payment_from_id = "account:fa5a0646-33dc-4f66-bd48-39f89624f5fe"
    expenses = []
    for expense in compile_hsa_expenses():
        expense = Expense(
            user_id=USER_ID,
            expense_id=f"expense:{uuid4()}",
            date=expense["date"],
            amount=expense["amount"],
            category="HSA",
            subcategory="HSA",
            merchant=expense["merchant"],
            pending=False,
            payment_from_id=payment_from_id,
            recurring_id="",
            description="",
        )
        expenses.append(expense)

    with Expense.batch_write() as batch:
        for expense in expenses:
            print(expense)
            batch.save(expense)


def update_sales():
    for sale in Sale.list(user_id=USER_ID):
        if get(sale, "gains") or get(sale, "losses"):
            continue

        security = Security.get_(USER_ID, sale.security_id)
        sale_price_per_share = (sale.amount + sale.fee) / sale.shares
        purchases = filter_(
            dynamo.Purchase.list(user_id=USER_ID),
            lambda purchase: purchase.security_id == security.security_id,
        )
        total_cost = sum(purchase.amount for purchase in purchases)
        total_shares = security.shares + sale.shares
        sale.cost_basis_per_share = total_cost / total_shares
        sale_price_per_share = sale.amount / sale.shares
        gain_loss_per_share = sale_price_per_share - sale.cost_basis_per_share
        gain_loss = gain_loss_per_share * sale.shares

        if gain_loss > 0:
            sale.gains = round(gain_loss, 2)
        else:
            sale.losses = round(gain_loss, 2)

        print(sale.date)
        print(
            f"Sold {sale.shares} shares of {security.ticker} for ${sale.price} per share: ${sale.amount} (fee: ${sale.fee})"
        )
        print(f"\tCost basis per share: ${sale.cost_basis_per_share}")
        print(f"\tGain/loss per share: ${gain_loss_per_share}")
        if sale.gains:
            print(f"\tGains: ${sale.gains}")
        if sale.losses:
            print(f"\tLosses: ${sale.losses}")

        # sale.save()


def test():
    pass


def main():
    pass
