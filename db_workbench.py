# pylint: disable=import-error, unused-import, wrong-import-position, missing-function-docstring
"""workbench"""

import os
from pprint import pprint
from datetime import datetime, timedelta

from yahoo_fin import stock_info
from pydash import uniq_by, reduce_, filter_, map_, find, remove

os.environ["WB_DOMAIN"] = "localhost"
os.environ["WB_PORT"] = "27017"

from api import mongo
from api.mongo.connection import database


def test():
    pass


if __name__ == "__main__":
    pass
