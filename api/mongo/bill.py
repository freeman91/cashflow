# pylint: disable= missing-function-docstring

"""monog.bill submodule"""

from typing import List, Union

from pydash import get as _get

from api.mongo.models.Bill import Bill
from .connection import database
from .models.common import PydanticObjectId


def get(_id: str = None) -> Union[Bill, List[Bill]]:
    """
    GET

    mongo.bill.get(): returns all bills
    mongo.bill.get("<bill_id>"): returns a single bill or None if it doesn't exist
    """

    if _id:
        bill = database.bills.find_one({"_id": PydanticObjectId(_id)})
        return Bill(**bill)

    return [Bill(**bill) for bill in database.bills.find()]


def create(bill: dict) -> Bill:
    """
    CREATE

    mongo.bill.create(<bill>): inserts new bill in the db
        - name: str
        - amount: float
        - type: str
        - vendor: str
        - rule: List
        - description: str
    """

    return get(Bill(**bill).create())


def update(bill: dict) -> Bill:
    """
    UPDATE

    mongo.bill.update(<bill>): updates an existing bill in the db
        - name: str
        - amount: float
        - type: str
        - vendor: str
        - rule: List
        - description: str
    """

    bill_record = get(_get(bill, "id"))
    bill_record.name = float(_get(bill, "name"))
    bill_record.amount = float(_get(bill, "amount"))
    bill_record.type = _get(bill, "type")
    bill_record.vendor = _get(bill, "vendor")
    bill_record.rule = _get(bill, "rule")
    bill_record.description = _get(bill, "description")

    bill_record.save()
    return bill_record


def delete(_id: str):
    """
    DELETE

    mongo.bill.delete<bill_id>): deleted an bill in the db if it exists
    """
    return database.bills.delete_one({"_id": PydanticObjectId(_id)})
