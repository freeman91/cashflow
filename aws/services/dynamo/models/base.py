"""BaseModel pynamodb model"""

import os
from datetime import datetime, date
from pynamodb.models import Model
from pynamodb.attributes import MapAttribute


REGION: str = os.getenv("REGION")


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
