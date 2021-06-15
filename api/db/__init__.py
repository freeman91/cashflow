import os

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

load_dotenv()

ENV = os.getenv("ENV") or "dev"
DOMAIN = os.getenv("MONGO_IP")
PORT = os.getenv("MONGO_PORT")
MONGO_INITDB_DATABASE = os.getenv("MONGO_INITDB_DATABASE")
MONGO_INITDB_ROOT_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_INITDB_ROOT_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
MONGO_URI = os.getenv("MONGO_URI")


def connect() -> MongoClient:
    try:
        client = None
        if ENV == "dev":
            client = MongoClient(
                host=["localhost:27017"],
                serverSelectionTimeoutMS=5000,
                username=MONGO_INITDB_ROOT_USERNAME,
                password=MONGO_INITDB_ROOT_PASSWORD,
            )
        else:
            client = MongoClient(MONGO_URI)

        print("server version:", client.server_info()["version"])
        return client[MONGO_INITDB_DATABASE]

    except ServerSelectionTimeoutError as err:
        client = None
        print("pymongo ERROR:", err)


database = connect()
