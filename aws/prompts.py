"""Prompts for the application"""

import os
from datetime import datetime, timezone
from typing import List
import inquirer
from pydash import sort_by, find

from src.services.dynamo import (
    Account,
    Audit,
    Borrow,
    # Budget,
    # Categories,
    Expense,
    # History,
    Income,
    Paycheck,
    Purchase,
    Recurring,
    Repayment,
    Sale,
    Security,
    # Transfer,
    User,
)


def resource(resources: List, resource_type: str):
    if len(resources) == 1:
        return resources[0].get("value")

    _resource = inquirer.prompt(
        [
            inquirer.List(
                "RESOURCE",
                message=f"Select {resource_type}",
                choices=[resource["name"] for resource in resources],
                carousel=True,
            )
        ]
    ).get("RESOURCE")

    if not _resource:
        raise ValueError(f"You must select a {resource_type}")

    return find(resources, lambda resource: resource["name"] == _resource).get("value")


def user() -> User:
    users = [
        {"name": f"{user.name} [{user.email}]", "value": user}
        for user in sort_by(User.list(), lambda user: user.name)
    ]

    return resource(users, "User")


def account() -> Account:
    _user = user()
    accounts = [
        {"name": f"{account.name} [{account.account_id}]", "value": account}
        for account in sort_by(Account.list(user_id=_user.user_id), "name")
    ]

    return resource(accounts, "Account")


def recurring() -> Recurring:
    _user = user()
    recurrings = [
        {"name": f"{recurring.name} [{recurring.item_type}]", "value": recurring}
        for recurring in sort_by(Recurring.list(user_id=_user.user_id), "name")
    ]

    return resource(recurrings, "Recurring")


def borrow() -> Borrow:
    _user = user()
    borrows = [
        {"name": f"{borrow.name} [{borrow.account_id}]", "value": borrow}
        for borrow in sort_by(Borrow.list(user_id=_user.user_id), "name")
    ]

    return resource(borrows, "Borrow")


def expense() -> Expense:
    _user = user()
    expenses = [
        {"name": f"{expense.name} [{expense.account_id}]", "value": expense}
        for expense in sort_by(Expense.list(user_id=_user.user_id), "name")
    ]

    return resource(expenses, "Expense")


def income() -> Income:
    _user = user()
    incomes = [
        {"name": f"{income.name} [{income.account_id}]", "value": income}
        for income in sort_by(Income.list(user_id=_user.user_id), "name")
    ]

    return resource(incomes, "Income")


def paycheck() -> Paycheck:
    _user = user()
    paychecks = [
        {"name": f"{paycheck.name} [{paycheck.account_id}]", "value": paycheck}
        for paycheck in sort_by(Paycheck.list(user_id=_user.user_id), "name")
    ]

    return resource(paychecks, "Paycheck")


def purchase() -> Purchase:
    _user = user()
    purchases = [
        {"name": f"{purchase.name} [{purchase.account_id}]", "value": purchase}
        for purchase in sort_by(Purchase.list(user_id=_user.user_id), "name")
    ]

    return resource(purchases, "Purchase")


def repayment() -> Repayment:
    _user = user()
    repayments = [
        {"name": f"{repayment.name} [{repayment.account_id}]", "value": repayment}
        for repayment in sort_by(Repayment.list(user_id=_user.user_id), "name")
    ]

    return resource(repayments, "Repayment")


def sale() -> Sale:
    _user = user()
    sales = [
        {"name": f"{sale.security_id} [{sale.date}]", "value": sale}
        for sale in sort_by(Sale.list(user_id=_user.user_id), "date")
    ]

    return resource(sales, "Sale")


def security() -> Security:
    _user = user()
    securities = [
        {"name": f"{security.name} [{security.ticker}]", "value": security}
        for security in sort_by(Security.list(user_id=_user.user_id), "name")
    ]

    return resource(securities, "Security")


def audit() -> Audit:
    audits = [
        {"name": f"{audit.timestamp} [{audit.user_id}]", "value": audit}
        for audit in sort_by(Audit.scan(), "timestamp")
    ]
    return resource(audits, "Audit")
