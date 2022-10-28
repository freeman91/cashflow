# pylint: disable= missing-function-docstring

"""monog.account submodule"""

from typing import List, Union

from pydash import get as _get, filter_

from api.mongo.models.Account import Account
from .connection import database
from .models.common import PydanticObjectId


def get(_id: str = None, type_: str = None) -> Union[Account, List[Account]]:
    """
    GET

    mongo.account.get(): returns all accounts
    mongo.account.get("<account_id>"): returns a single account or None if it doesn't exist
    """

    if _id:
        account = database.accounts.find_one({"_id": PydanticObjectId(_id)})
        return Account(**account)

    if type_:
        return filter_(get(), lambda account: account.type == type_)

    return [Account(**account) for account in database.accounts.find()]


def create(account: dict) -> Account:
    """
    CREATE

    mongo.account.create(<account>): inserts new account in the db
        - name: str
        - assets: List
        - debts: List
        - description: Optional[str]
    """
    return get(Account(**account).create())


def update(account: dict) -> Account:
    """
    UPDATE

    mongo.account.update(<account>): updates an existing account in the db
        - name: str
        - assets: List
        - debts: List
        - description: Optional[str]
    """

    account_obj = get(_get(account, "id"))
    account_obj.name = _get(account, "name")
    account_obj.assets = _get(account, "assets")
    account_obj.debts = _get(account, "debts")
    account_obj.description = _get(account, "description")

    account_obj.save()
    return account_obj


def delete(_id: str):
    """
    DELETE

    mongo.account.delete<account_id>): deleted an account in the db if it exists
    """
    return database.accounts.delete_one({"_id": PydanticObjectId(_id)})
