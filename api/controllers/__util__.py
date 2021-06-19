from datetime import datetime
from bson.objectid import ObjectId
from bson.json_util import dumps


def serialize_dict(item):
    for attr in item:
        if type(item[attr]) == ObjectId:
            item[attr] = str(item[attr])
        elif type(item[attr]) == datetime:
            item[attr] = round(item[attr].timestamp())

    return dumps(item)
