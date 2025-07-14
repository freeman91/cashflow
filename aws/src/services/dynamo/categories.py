# pylint: disable=too-many-arguments, arguments-renamed
"""Categories pynamodb model"""

import os
from typing import List, Optional
from pynamodb.attributes import ListAttribute, UnicodeAttribute, MapAttribute

from .base import BaseModel

TYPE = "categories"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")

NEEDS = "needs"  # absolute necessities
WANTS = "wants"  # improve quality of life
LUXURIES = "luxuries"  # pure indulgences
LABELS = [NEEDS, WANTS, LUXURIES]


class Subcategory(MapAttribute):
    name = UnicodeAttribute(default="")
    label = UnicodeAttribute(default=WANTS)

    def __repr__(self):
        return f"Subcategory<{self.name}, {self.label}>"


class Category(MapAttribute):
    name = UnicodeAttribute()
    subcategories = ListAttribute(of=Subcategory)
    color = UnicodeAttribute(null=True)

    def __repr__(self):
        return f"Category<{self.name}>"


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

    @classmethod
    def create(cls, user_id: str, category_type: str, categories: List) -> "Categories":
        categories = cls(
            user_id=user_id, category_type=category_type, categories=categories
        )
        categories.save()
        return categories

    @classmethod
    def get_(cls, user_id: str, category_type: str) -> "Categories":
        return super().get_(user_id, category_type)

    @classmethod
    def list(
        cls, user_id: Optional[str] = None, category_type: Optional[str] = None
    ) -> list["Categories"]:
        return super().list(user_id, category_type)
