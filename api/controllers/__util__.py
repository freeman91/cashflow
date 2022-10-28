# pylint: disable = missing-function-docstring, broad-except
"""controller utility functions"""

import traceback
from datetime import datetime
from http import HTTPStatus
from pydash import set_
from bson.objectid import ObjectId


def success_result(payload, status_code: HTTPStatus = HTTPStatus.OK):
    return {"result": serialize(payload)}, status_code


def failure_result(
    message: str = "Bad Request", status_code: HTTPStatus = HTTPStatus.BAD_REQUEST
):
    return {"result": message}, status_code


def set_date(item: dict):
    return set_(
        item,
        "date",
        datetime.strptime(item["date"], "%m-%d-%Y").replace(hour=12),
    )


def set_last_update(item: dict):
    return set_(
        item,
        "last_update",
        datetime.now().replace(hour=12),
    )


def handle_exception(func):
    """wrap the function in a try/except block"""

    def wrap(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as err:
            traceback.print_exc()
            return failure_result(
                f"Action unsuccessful: {err}",
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            )

    return wrap


def serialize(item):

    if isinstance(item, list):
        return [serialize(elem) for elem in item]

    if isinstance(item, dict):
        for attr in item:
            item[attr] = serialize(item[attr])

    if isinstance(item, ObjectId):
        return str(item)

    if isinstance(item, datetime):
        return item.strftime("%Y-%m-%d")

    if hasattr(item, "json"):
        return item.json()

    return item
