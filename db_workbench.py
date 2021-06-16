from pprint import pprint

from api.db import user
from api.db import database as db


def create_default_user():
    name = "Addison"
    email = "addisonfreeman91@gmail.com"
    income_types = ["paycheck", "sale"]
    income_sources = ["DES", "Government", "broker", "other"]  # employer always first
    income_deductions = ["401k", "tax", "benefits", "other"]
    expense_types = []
    expense_vendors = []
    asset_types = ["cash", "checking", "stock", "crypto", "owed", "savings", "vehicle"]
    debt_types = ["credit", "loan", "tuition"]
    networth = -10638.81

    user.create(
        name=name,
        email=email,
        income_types=income_types,
        income_sources=income_sources,
        income_deductions=income_deductions,
        expense_types=expense_types,
        expense_vendors=expense_vendors,
        asset_types=asset_types,
        debt_types=debt_types,
        networth=networth,
    )


if __name__ == "__main__":
    pass
