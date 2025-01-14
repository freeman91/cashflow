# pylint: disable=wrong-import-position, wrong-import-order, unused-import, wildcard-import
"""Dev workbench for aws"""

import os
import json
from datetime import date, datetime, timedelta, timezone
from pprint import pprint

from pydash import (
    find,
    group_by,
    get,
    head,
    map_,
    uniq,
    sort_by,
    filter_,
    remove,
    reduce_,
    last,
    find_index,
)

import prompts
from services import dynamo
from services.dynamo import *

ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")
USER_ID = os.getenv("REACT_APP_USER_ID")


def test():
    pass


def main():
    pass
