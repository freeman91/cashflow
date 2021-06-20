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


def success_result(payload):
    return {"result": serialize_dict(payload)}, 200


def failure_result(message):
    return {"result": message}, 400
