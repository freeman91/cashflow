"""Categories pynamodb model"""

import os
from pynamodb.attributes import (
    ListAttribute,
    UnicodeAttribute,
    MapAttribute,
)

from .base import BaseModel

TYPE = "categories"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Category(MapAttribute):
    name = UnicodeAttribute()
    subcategories = ListAttribute(of=UnicodeAttribute)


class Categories(BaseModel):
    class Meta:
        region = REGION
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"

    user_id = UnicodeAttribute(hash_key=True)
    category_type = UnicodeAttribute(range_key=True, default="expense")
    _type = UnicodeAttribute(default=TYPE)

    categories = ListAttribute(default=[], of=Category)

    def __repr__(self):
        return f"Categories<{self.user_id}, {self.category_type}>"
