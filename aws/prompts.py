from typing import List

import inquirer
from pydash import sort_by, find


from services import dynamo
from services.dynamo.models.account import Account
from services.dynamo.models.asset import Asset
from services.dynamo.models.bill import Bill
from services.dynamo.models.borrow import Borrow
from services.dynamo.models.debt import Debt
from services.dynamo.models.expense import Expense
from services.dynamo.models.income import Income
from services.dynamo.models.networth import Networth
from services.dynamo.models.option_list import OptionList
from services.dynamo.models.paycheck import Paycheck
from services.dynamo.models.purchase import Purchase
from services.dynamo.models.repayment import Repayment
from services.dynamo.models.sale import Sale
from services.dynamo.models.user import User


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
        for user in sort_by(dynamo.user.get(), lambda user: user.name)
    ]

    return resource(users, "User")


def account() -> Account:
    _user = user()
    accounts = [
        {"name": f"{account.name} [{account.account_id}]", "value": account}
        for account in sort_by(dynamo.account.get(user_id=_user.user_id), "name")
    ]

    return resource(accounts, "Account")


def asset() -> Asset:
    _user = user()
    assets = [
        {"name": f"{asset.name} [{asset.account_id}]", "value": asset}
        for asset in sort_by(dynamo.asset.get(user_id=_user.user_id), "name")
    ]

    return resource(assets, "Asset")


def bill() -> Bill:
    _user = user()
    bills = [
        {"name": f"{bill.name} [{bill.account_id}]", "value": bill}
        for bill in sort_by(dynamo.bill.get(user_id=_user.user_id), "name")
    ]

    return resource(bills, "Bill")


def borrow() -> Borrow:
    _user = user()
    borrows = [
        {"name": f"{borrow.name} [{borrow.account_id}]", "value": borrow}
        for borrow in sort_by(dynamo.borrow.get(user_id=_user.user_id), "name")
    ]

    return resource(borrows, "Borrow")


def debt() -> Debt:
    _user = user()
    debts = [
        {"name": f"{debt.name} [{debt.account_id}]", "value": debt}
        for debt in sort_by(dynamo.debt.get(user_id=_user.user_id), "name")
    ]

    return resource(debts, "Debt")


def expense() -> Expense:
    _user = user()
    expenses = [
        {"name": f"{expense.name} [{expense.account_id}]", "value": expense}
        for expense in sort_by(dynamo.expense.get(user_id=_user.user_id), "name")
    ]

    return resource(expenses, "Expense")


def income() -> Income:
    _user = user()
    incomes = [
        {"name": f"{income.name} [{income.account_id}]", "value": income}
        for income in sort_by(dynamo.income.get(user_id=_user.user_id), "name")
    ]

    return resource(incomes, "Income")


def networth() -> Networth:
    _user = user()
    networths = [
        {"name": f"{networth.name} [{networth.account_id}]", "value": networth}
        for networth in sort_by(dynamo.networth.get(user_id=_user.user_id), "name")
    ]

    return resource(networths, "Networth")


def option_list() -> OptionList:
    _user = user()
    option_lists = [
        {"name": f"{option_list.option_type}", "value": option_list}
        for option_list in sort_by(
            dynamo.option_list.get(user_id=_user.user_id), "name"
        )
    ]

    return resource(option_lists, "OptionList")


def paycheck() -> Paycheck:
    _user = user()
    paychecks = [
        {"name": f"{paycheck.name} [{paycheck.account_id}]", "value": paycheck}
        for paycheck in sort_by(dynamo.paycheck.get(user_id=_user.user_id), "name")
    ]

    return resource(paychecks, "Paycheck")


def purchase() -> Purchase:
    _user = user()
    purchases = [
        {"name": f"{purchase.name} [{purchase.account_id}]", "value": purchase}
        for purchase in sort_by(dynamo.purchase.get(user_id=_user.user_id), "name")
    ]

    return resource(purchases, "Purchase")


def repayment() -> Repayment:
    _user = user()
    repayments = [
        {"name": f"{repayment.name} [{repayment.account_id}]", "value": repayment}
        for repayment in sort_by(dynamo.repayment.get(user_id=_user.user_id), "name")
    ]

    return resource(repayments, "Repayment")


def sale() -> Sale:
    _user = user()
    sales = [
        {"name": f"{sale.name} [{sale.account_id}]", "value": sale}
        for sale in sort_by(dynamo.sale.get(user_id=_user.user_id), "name")
    ]

    return resource(sales, "Sale")
