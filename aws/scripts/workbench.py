#!/usr/bin/env python3
"""Dev workbench for aws"""

import os
from dotenv import load_dotenv

load_dotenv(f"{os.getcwd()}/.env")
ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")


def test():
    pass


if __name__ == "__main__":
    ...
