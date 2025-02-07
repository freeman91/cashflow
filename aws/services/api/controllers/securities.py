"""Securities controller"""

from datetime import datetime, timezone
from flask import Blueprint, request

from services.dynamo import Security
from services.api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

securities = Blueprint("securities", __name__)


@handle_exception
@securities.route("/securities/<user_id>", methods=["POST", "GET"])
def _securities(user_id: str):
    if request.method == "POST":
        body = request.json
        security = Security.create(
            user_id=body.get("user_id"),
            account_id=body.get("account_id"),
            name=body.get("name"),
            ticker=body.get("ticker"),
            security_type=body.get("security_type"),
            shares=body.get("shares"),
            price=body.get("price"),
            icon_url=body.get("icon_url"),
        )
        return success_result(security.as_dict())

    if request.method == "GET":
        return success_result(
            [security.as_dict() for security in Security.list(user_id=user_id)]
        )
    return failure_result()


@handle_exception
@securities.route(
    "/securities/<user_id>/<security_id>", methods=["GET", "PUT", "DELETE"]
)
def _security(user_id: str, security_id: str):
    if request.method == "GET":
        return success_result(
            Security.get_(user_id=user_id, security_id=security_id).as_dict()
        )

    if request.method == "PUT":
        security = Security.get_(user_id=user_id, security_id=security_id)

        for attr in ["shares", "price"]:
            if attr in request.json:
                setattr(security, attr, float(request.json.get(attr) or 0))

        for attr in [
            "account_id",
            "name",
            "ticker",
            "security_type",
            "icon_url",
            "active",
        ]:
            if attr in request.json:
                setattr(security, attr, request.json.get(attr))

        security.last_update = datetime.now(timezone.utc)
        security.save()
        return success_result(security.as_dict())

    if request.method == "DELETE":
        Security.get_(user_id=user_id, security_id=security_id).delete()
        return success_result(f"{security_id} deleted")

    return failure_result()
