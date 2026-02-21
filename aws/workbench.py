"""Workbench for development and testing"""

import os
import sys
from datetime import datetime, timezone
from typing import List
import inquirer
from pydash import sort_by, find, filter_
from pprint import pprint

from dotenv import load_dotenv
import prompts
from src.services import dynamo

ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


def delete_all_audits():
    audits_ = dynamo.Audit.scan()
    # batch delete all audits
    with dynamo.Audit.batch_write() as batch:
        for audit in audits_:
            batch.delete(audit)

def main():
    pass
