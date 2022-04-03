# pylint: disable = missing-class-docstring, missing-function-docstring, no-self-use, raise-missing-from, no-member, no-self-argument, too-few-public-methods

"""MODELS - COMMON
Common variables and base classes for the models
"""

from datetime import datetime
from pprint import pformat
from typing import List, Union
import pydantic
from bson import ObjectId
from bson.errors import InvalidId

__all__ = ("BaseModel",)


class BaseModel(pydantic.BaseModel):
    """All data models inherit from this class"""

    @pydantic.root_validator(pre=True)
    def _min_properties(cls, data):
        """At least one property is required"""
        if not data:
            raise ValueError("At least one property is required")
        return data

    def dict(self, include_nulls=False, **kwargs):
        """Override the super dict method by removing null keys from the dict,
        unless include_nulls=True"""
        kwargs["exclude_none"] = not include_nulls
        return super().dict(**kwargs)

    def bson(self):
        return self.dict(by_alias=True, exclude_none=True)

    def json(self):
        ret_dict = {}
        for key, value in self.dict().items():
            if isinstance(value, (PydanticObjectId, ObjectId)):
                ret_dict[key] = str(value)
            elif isinstance(value, datetime):
                ret_dict[key] = value.strftime("%Y-%m-%d")
            else:
                ret_dict[key] = value
        return ret_dict

    def __str__(self):
        return pformat(self.dict())

    class Config:
        extra = pydantic.Extra.forbid  # forbid sending additional fields/properties
        anystr_strip_whitespace = True  # strip whitespaces from strings


class PydanticObjectId(ObjectId):
    """
    Object Id field. Compatible with Pydantic.
    """

    @classmethod
    def __get_validators__(cls):
        yield cls.validate

    @classmethod
    def validate(cls, val):
        if isinstance(val, bytes):
            val = val.decode("utf-8")
        try:
            return PydanticObjectId(val)
        except InvalidId:
            raise TypeError("Id must be of type PydanticObjectId")

    @classmethod
    def __modify_schema__(cls, field_schema):
        field_schema.update(
            type="string",
            examples=["5eb7cf5a86d9755df3a6c593", "5eb7cfb05e32e07750a1756a"],
        )


def attr2obj(attr) -> Union[(List, dict, int)]:
    """converts all list values and dict value to objects"""

    value = attr
    if isinstance(attr, ObjectId):
        return str(attr)

    return value
