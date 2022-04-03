# pylint: disable=missing-class-docstring, too-few-public-methods
"""app config environment variables"""

import logging
import os
from dotenv import load_dotenv

load_dotenv(verbose=True)


class Config:
    LOG_LEVEL = logging.INFO


class DevelopmentConfig(Config):
    ENV = "dev"
    LOG_LEVEL = logging.DEBUG
    DEBUG = True
    SECRET_KEY = "secr3t"
    APP_FQDN = "localhost:9000"
    DATABASE_HOST = os.getenv("MONGO_IP", "localhost")
    DATABASE_PORT = os.getenv("MONGO_PORT", "27017")


class TestConfig(Config):
    ENV = "test"
    LOG_LEVEL = logging.DEBUG
    SECRET_KEY = "test"
    APP_FQDN = "localhost:9000"
    DATABASE_HOST = os.getenv("MONGO_IP", "localhost")
    DATABASE_PORT = os.getenv("MONGO_PORT", "27018")


class ProductionConfig(Config):
    ENV = "production"
    LOG_LEVEL = logging.DEBUG
    DEBUG = True
    SECRET_KEY = "s3cret"
    APP_FQDN = ""
    DATABASE_HOST = os.getenv("DATABASE_HOST", "localhost")
    DATABASE_PORT = os.getenv("DATABASE_PORT", "27017")


def get_config():
    """return config corresponding to the environment"""

    env = os.environ.get("ENV", "dev").lower()
    if env == "dev":
        return DevelopmentConfig
    if env == "test":
        return TestConfig
    if env == "production":
        return ProductionConfig

    return Config


AppConfig = get_config()
