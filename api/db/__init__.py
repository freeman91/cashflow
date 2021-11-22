import os, json

from dotenv import load_dotenv
from pymongo import MongoClient
from pymongo.errors import ServerSelectionTimeoutError

load_dotenv()

WB_DOMAIN = os.getenv("WB_DOMAIN")
WB_PORT = os.getenv("WB_PORT")
ENV = os.getenv("ENV") or "dev"
DOMAIN = WB_DOMAIN or os.getenv("MONGO_IP")
PORT = WB_PORT or os.getenv("MONGO_PORT")
MONGO_INITDB_DATABASE = os.getenv("MONGO_INITDB_DATABASE")
MONGO_INITDB_ROOT_USERNAME = os.getenv("MONGO_INITDB_ROOT_USERNAME")
MONGO_INITDB_ROOT_PASSWORD = os.getenv("MONGO_INITDB_ROOT_PASSWORD")
MONGO_URI = os.getenv("MONGO_URI")
NAME = os.getenv("NAME")
EMAIL = os.getenv("EMAIL")
CRYPTO_KEY = os.getenv("CRYPTO_COMPARE_KEY")
INCOME_TYPES = json.loads(os.getenv("INCOME_TYPES"))
INCOME_SOURCES = json.loads(os.getenv("INCOME_SOURCES"))
INCOME_DEDUCTIONS = json.loads(os.getenv("INCOME_DEDUCTIONS"))
EXPENSE_TYPES = json.loads(os.getenv("EXPENSE_TYPES"))
EXPENSE_VENDORS = json.loads(os.getenv("EXPENSE_VENDORS"))
ASSET_TYPES = json.loads(os.getenv("ASSET_TYPES"))
DEBT_TYPES = json.loads(os.getenv("DEBT_TYPES"))
GOAL_CATEGORIES = json.loads(os.getenv("GOAL_CATEGORIES"))


def connect() -> MongoClient:
    try:
        client = None
        client = MongoClient(
            host=[f"{DOMAIN}:{PORT}"],
            serverSelectionTimeoutMS=5000,
            username=MONGO_INITDB_ROOT_USERNAME,
            password=MONGO_INITDB_ROOT_PASSWORD,
        )

        # print("server version:", client.server_info()["version"])
        return client[MONGO_INITDB_DATABASE]

    except ServerSelectionTimeoutError as err:
        client = None
        print("pymongo ERROR:", err)


database = connect()
