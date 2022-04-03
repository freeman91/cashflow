# pylint: disable=missing-function-docstring
"""user module"""

from api.mongo.models.User import User
from .connection import database


def get():
    return User(**database.users.find_one())
