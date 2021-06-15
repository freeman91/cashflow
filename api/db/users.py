from api.db import database as db


def create(
    name: str,
    email: str,
    networth: float,
    income_types=[],
    income_deductions=[],
    income_sources=[],
    expense_types=[],
    expense_vendors=[],
    asset_types=[],
    debt_types=[],
):
    user = {
        "name": name,
        "email": email,
        "incomes": {
            "types": income_types,
            "sources": income_sources,
            "deductions": income_deductions,
        },
        "expenses": {
            "types": expense_types,
            "vendors": expense_vendors,
        },
        "assets": {
            "types": asset_types,
        },
        "debts": {
            "types": debt_types,
        },
        "current_networth": networth,
    }

    print(f"user: {user}")


def get():
    pass


def get_income_types():
    pass


def update_income_types():
    pass


def get_income_sources():
    pass


def update_income_sources():
    pass


def get_income_deductions():
    pass


def update_income_deductions():
    pass


def get_expense_types():
    pass


def update_expense_types():
    pass


def get_expense_vendors():
    pass


def update_expense_vedors():
    pass


def update_current_networth():
    pass


def delete(id: str):
    pass
