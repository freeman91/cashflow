# pylint: disable=import-error, unused-import, wrong-import-position, missing-function-docstring, unused-variable, invalid-name
"""workbench"""

import os
from pprint import pprint
from datetime import datetime, timedelta
from ofxtools import OFXClient
from ofxtools.scripts import ofxget

from yahoo_fin import stock_info
from pydash import uniq_by, reduce_, filter_, map_, find, remove, mean

from api.controllers.__util__ import set_last_update

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
    account = {
        "name": "Huntington",
        "assets": map_(prompts.assets(), lambda _asset: _asset.id),
        "debts": map_(prompts.debts(), lambda _debt: _debt.id),
    }
    account = set_last_update(account)
    print(account)
    return account


if __name__ == "__main__":
    pass
