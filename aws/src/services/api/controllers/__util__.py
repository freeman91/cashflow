# pylint: disable = broad-except
"""controller utility functions"""

from datetime import datetime
from http import HTTPStatus
from flask import request
from pydash import set_

from ...dynamo import Audit


def success_result(payload, status_code: HTTPStatus = HTTPStatus.OK):
    return {"result": payload}, status_code


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


def log_action(user_id: str, message: str, status: str = "success"):
    Audit.create(
        user_id=user_id,
        action=f"{request.method} - {request.url_rule.rule}",
        status=status,
        message=message,
    )


def handle_exception(func):
    """wrap the function in a try/except block"""

    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as err:
            # traceback.print_exc()
            user_id = kwargs.get("user_id", "SYSTEM")
            log_action(user_id, f"Action unsuccessful: {err.args[0]}", status="error")

            return failure_result(
                f"Action unsuccessful: {err}",
                status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            )

    wrapper.__name__ = func.__name__
    return wrapper
