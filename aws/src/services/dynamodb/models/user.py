"""User pynamodb model"""

import os
from pynamodb.models import Model
from pynamodb.attributes import ListAttribute, UnicodeAttribute


TYPE = "user"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class User(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

    user_id = UnicodeAttribute(hash_key=True)
    email = UnicodeAttribute(range_key=True)
    password = UnicodeAttribute()
    _type = UnicodeAttribute(default=TYPE)
    asset_types = ListAttribute(
        default=[
            "cash",
            "checking",
            "crypto",
            "owed",
            "property",
            "retirement",
            "savings",
            "stock",
            "vehicle",
        ]
    )
    debt_types = ListAttribute(default=["credit", "loan", "tuition"])
    expense_types = ListAttribute(default=[])
    income_sources = ListAttribute(
        default=["other", "federal government", "veregy", "ohio government"]
    )
