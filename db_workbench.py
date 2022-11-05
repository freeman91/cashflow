# pylint: disable=import-error, unused-import, wrong-import-position, missing-function-docstring, unused-variable, invalid-name
"""workbench"""

import os
from pprint import pprint
from datetime import datetime, timedelta
from ofxtools import OFXClient
from ofxtools.scripts import ofxget

from yahoo_fin import stock_info
from pydash import uniq_by, reduce_, filter_, map_, find, remove, mean, get

from api.controllers.__util__ import set_last_update
from api.controllers.cronjobs import get_stock_price

os.environ["WB_DOMAIN"] = "localhost"
os.environ["WB_PORT"] = "27017"

from api import mongo
import prompts


def ofx():
    client = OFXClient(
        "https://ofx.huntington.com/Ofx/process.ofx",
        userid="AEFreeman1",
        org="huntington",
        fid="3701",
        version=220,
        prettyprint=True,
        bankid=None,
    )
    print(f"{client = }")
    a0 = ofxget.AcctInfo(acctid="1", accttype="CHECKING")
    print(a0)


def test():
    pass


if __name__ == "__main__":
    pass
