from datetime import datetime
from bson.objectid import ObjectId
from bson.json_util import dumps


def serialize(item):
    if type(item) == list:
        return [serialize(elem) for elem in item]

    if type(item) == str:
        return item
    if type(item) == dict:
        for attr in item:
            if type(item[attr]) == list:
                item[attr] = serialize(item[attr])
            if type(item[attr]) == ObjectId:
                item[attr] = str(item[attr])
            elif type(item[attr]) == datetime:
                item[attr] = round(item[attr].timestamp())

        return dumps(item)


def success_result(payload):
    if type(payload) == dict:
        return {"result": serialize(payload)}, 200
    else:
        return payload


def failure_result(message):
    return {"result": message}, 400
