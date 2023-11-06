# pylint: disable=wrong-import-position, wrong-import-order, unused-import
#!/usr/bin/env python3
"""Dev workbench for aws"""

import os
from datetime import date, datetime, timezone
from pprint import pprint
import prompts
from services import dynamo

ENV = os.getenv("ENV")
REGION = os.getenv("REGION")
APP_ID = os.getenv("APP_ID")


def test():
    user_id = "user:3b72aad0-e9b9-4c06-86d8-0fb5ca8f6d47"

    start = datetime(2023, 10, 1, tzinfo=timezone.utc)
    end = datetime(2023, 10, 31, tzinfo=timezone.utc)

    dynamo.expense.search(user_id, start, end)
