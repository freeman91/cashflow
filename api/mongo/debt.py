"""mongo.debt submodule"""

from typing import List, Union

from pydash import get as _get

from api.mongo.models.Debt import Debt
from .connection import database
from .models.common import PydanticObjectId


def get(_id: str = None) -> Union[Debt, List[Debt]]:
    """
    GET

    mongo.debt.get(): returns all debts
    mongo.debt.get("<debt_id>"): returns a single debt or None if it doesn't exist
    """

    if _id:
        debt = database.debts.find_one({"_id": PydanticObjectId(_id)})
        return Debt(**debt)

    return [Debt(**debt) for debt in database.debts.find()]


def create(debt: dict) -> Debt:
    """
    CREATE

    mongo.debt.create(<debt>): inserts new debt in the db
        - account_id: str
        - name: str
        - value: float
        - type: str
        - vendor: Optional[str]
        - description: Optional[str]
    """
    return get(Debt(**debt).create())


def update(debt: dict) -> Debt:
    """
    UPDATE

    mongo.debt.update(<debt>): updates an existing debt in the db
        - name: str
        - value: float
        - type: str
        - vendor: Optional[str]
        - description: Optional[str]
    """

    debt_obj = get(_get(debt, "id"))
    debt_obj.name = _get(debt, "name")
    debt_obj.value = float(_get(debt, "value"))
    debt_obj.type = _get(debt, "type")
    debt_obj.vendor = _get(debt, "vendor")
    debt_obj.description = _get(debt, "description")

    debt_obj.save()
    return debt_obj


def delete(_id: str):
    """
    DELETE

    mongo.debt.delete<debt_id>): deleted an debt in the db if it exists
    """
    return database.debts.delete_one({"_id": PydanticObjectId(_id)})
