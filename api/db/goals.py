from api.db import database as db
from api.db.user import user


class Goals:
    pass


class Goal:
    pass


def create(month: int, year: int, goals: dict):
    """
    goals = {
        "expense_type": amount,
        ...
    }
    """
    pass


def update(month: int, year: int, goals: list):
    """only can update before the month starts"""
    pass


def get(s_month: int, s_year: int, e_month: int, e_year: int):
    """get goals in range"""
    pass
