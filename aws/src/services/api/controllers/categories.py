"""Categories controller"""

from flask import Blueprint, request
from pydash import sort_by

from ...dynamo import Categories
from .__util__ import (
    failure_result,
    handle_exception,
    success_result,
    log_action,
)

categories = Blueprint("categories", __name__)


@categories.route("/categories/<user_id>", methods=["POST", "GET"])
@handle_exception
def _categories(user_id: str):
    if request.method == "POST":
        pass

    if request.method == "GET":
        return success_result(
            [
                category_data.as_dict()
                for category_data in Categories.list(user_id=user_id)
            ]
        )
    return failure_result()


@categories.route(
    "/categories/<user_id>/<category_type>", methods=["GET", "POST", "PUT", "DELETE"]
)
@handle_exception
def _category_data(user_id: str, category_type: str):
    if request.method == "GET":
        result = Categories.get_(user_id=user_id, category_type=category_type)
        return success_result(result.as_dict())

    if request.method == "POST":
        category_data = Categories.create(
            user_id=user_id,
            category_type=category_type,
            categories=request.json.get("categories"),
        )
        log_action(user_id, f"Category created: {category_type}")
        return success_result(category_data.as_dict())

    if request.method == "PUT":
        category_data = Categories.get_(user_id=user_id, category_type=category_type)

        updated_categories = sort_by(request.json.get("categories"), "name")
        category_data.categories = updated_categories
        category_data.save()
        log_action(user_id, f"Category updated: {category_type}")
        return success_result(category_data.as_dict())

    if request.method == "DELETE":
        pass

    return failure_result()
