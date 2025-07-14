"""BaseModel pynamodb model"""

import os
from typing import Optional, List, TypeVar
from datetime import datetime, date
from pynamodb.models import Model
from pynamodb.attributes import MapAttribute


REGION: str = os.getenv("REGION")
BaseModelType = TypeVar("BaseModelType", bound="BaseModel")


class BaseModel(Model):
    def attr2obj(self, attr):
        value = attr
        if isinstance(attr, list):
            _list = []
            for element in attr:
                _list.append(self.attr2obj(element))
            value = _list
        elif isinstance(attr, MapAttribute):
            _dict = {}
            for key, val in attr.attribute_values.items():
                _dict[key] = self.attr2obj(val)
            value = _dict
        elif isinstance(attr, (datetime, date)):
            return attr.isoformat()

        return value

    def as_dict(self):
        ret_dict = {}
        for name, attr in self.attribute_values.items():
            ret_dict[name] = self.attr2obj(attr)

        return ret_dict

    @classmethod
    def get_(cls, hash_key: str, range_key: str) -> Optional[BaseModelType]:
        """
        Retrieve an item with the given hash_key and range_key.
        If the item does not exist, it catches the DoesNotExist exception and returns None.

        :param hash_key: The hash key of the item to be retrieved
        :param range_key: The range key of the item to be retrieved
        :return: The retrieved item if found, otherwise None
        """

        try:
            return cls.get(hash_key, range_key)
        except cls.DoesNotExist:
            return None

    @classmethod
    def list(
        cls, hash_key: Optional[str] = None, range_key: Optional[str] = None
    ) -> List[BaseModelType]:
        """
        List items based on hash_key or range_key or neither.

        - If hash_key is provided, return items for the given hash_key.
        - If range_key is provided, return items for the given range_key.
        - If neither is provided, return all items.

        :param hash_key: Optional hash key to filter items by.
        :param range_key: Optional range key to filter items by.
        :return: List of BaseModelType items.
        :raises ValueError: If both hash_key and range_key are provided.
        """

        if hash_key and range_key:
            raise ValueError("Both hash_key and range_key cannot be provided together")

        if hash_key:
            return list(cls.query(hash_key))

        if range_key:
            return list(
                cls.scan(filter_condition=getattr(cls, cls._range_keyname) == range_key)
            )

        return list(cls.scan())
