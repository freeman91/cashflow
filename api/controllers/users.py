from pydash import get
from flask import request, Blueprint

from api.db.user import user
from api.controllers.__util__ import success_result

users = Blueprint("users", __name__)


@users.route("/user", methods=["GET", "PUT"])
def _user():
    if request.method == "GET":
        return success_result(user.item)

    elif request.method == "PUT":
        payload = request.json

        updated_list = get(payload, "updated")
        resource, setting = get(payload, "setting").split(".")

        user.update_setting(resource, setting, updated_list)

        _user = user.refresh()

        return success_result(_user)
