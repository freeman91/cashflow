"""Workbench for development and testing"""

import os
import sys
from datetime import datetime, timezone
from typing import List
import inquirer
from pydash import sort_by, find, filter_

from dotenv import load_dotenv

from src.services import dynamo

ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


def test():
    pass


def main():
    pass
