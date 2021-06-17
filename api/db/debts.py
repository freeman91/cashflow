from datetime import datetime

from api.db import database as db
from api.db.user import user


class Debts:
    pass


class Debt:
    pass


def get():
    pass


def get_expenses():
    pass


def get_asset():
    pass


def acquire():
    """ "create new debt or update debt"""
    pass


def reduce(debt: str):
    """
    no expense generated
    reduce debt amount
    """
    pass


def pay_off():
    """paying off a debt generates an expense
    - reduce debt amount
    - generate expense
    """
    pass
