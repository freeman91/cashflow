from flask import request, Blueprint


users = Blueprint("users", __name__)


@users.route("/users")
def user_add():
    return {"resp": "Success"}, 200
