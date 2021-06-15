from api.db import users
from api.db import database as db


def create_default_user():
    name = "Addison"
    email = "addisonfreeman91@gmail.com"
    income_types = []
    income_deductions = ["401k", "tax", "benefits", "other"]
    expense_types = []
    expense_vendors = []
    networth = 0

    users.create_user(
        name=name,
        email=email,
        income_types=income_types,
        income_deductions=income_deductions,
        expense_types=expense_types,
        expense_vendors=expense_vendors,
        networth=networth,
    )


if __name__ == "__main__":
    pass
