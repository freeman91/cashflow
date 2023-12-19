"""OptionList pynamodb model"""

import os
from pynamodb.attributes import ListAttribute, UnicodeAttribute

from .base import BaseModel

TYPE = "option_list"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class OptionList(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    option_type = UnicodeAttribute(range_key=True)
    # vendor, income_source, lender, expense_type, asset_type, debt_type
    _type = UnicodeAttribute(default=TYPE)

    options = ListAttribute(default=[])

    def __repr__(self):
        return f"OptionList<{self.user_id}, {self.option_type}>"
