# pylint: disable=missing-function-docstring
"""db connection"""

import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

load_dotenv()

ENV = os.getenv("ENV") or "dev"
DOMAIN = "localhost" if os.getenv("HOSTNAME") is None else os.getenv("MONGO_IP")
PORT = "27017" if os.getenv("HOSTNAME") is None else os.getenv("MONGO_PORT")
MONGO_INITDB_DATABASE = os.getenv("MONGO_INITDB_DATABASE")
MONGO_INITDB_ROOT_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_INITDB_ROOT_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")


def connect():
    try:
        _database = None

        client = MongoClient(
            host=[f"{DOMAIN}:{PORT}"],
            serverSelectionTimeoutMS=5000,
            username=MONGO_INITDB_ROOT_USERNAME,
            password=MONGO_INITDB_ROOT_PASSWORD,
        )
        _database = client[MONGO_INITDB_DATABASE]

        return _database

    except ServerSelectionTimeoutError as err:
        print("pymongo ERROR:", err)
        return None


database = connect()
