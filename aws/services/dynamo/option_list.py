# pylint: disable=too-many-arguments, arguments-renamed
"""OptionList pynamodb model"""

import os
from typing import List, Optional
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
    _type = UnicodeAttribute(default=TYPE)

    options = ListAttribute(default=[])

    def __repr__(self):
        return f"OptionList<{self.user_id}, {self.option_type}>"

    @classmethod
    def create(cls, user_id: str, option_type: str, options: List) -> "OptionList":
        option_list = cls(user_id=user_id, option_type=option_type, options=options)
        option_list.save()
        return option_list

    @classmethod
    def get_(cls, user_id: str, option_type: str) -> "OptionList":
        return super().get_(user_id, option_type)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, option_type: Optional[str] = None
    ) -> list["OptionList"]:
        return super().list(user_id, option_type)
