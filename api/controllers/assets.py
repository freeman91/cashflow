from flask import request, Blueprint
from datetime import datetime
from pydash import get, assign

from api.db.assets import Assets
from api.db.expenses import Expenses
from api.db.incomes import Incomes
from api.controllers.__util__ import success_result, failure_result

assets = Blueprint("assets", __name__)


@assets.route("/assets", methods=["POST", "GET"])
def _assets():

    try:
        if request.method == "GET":
            _assets = [asset for asset in Assets.get_all() if asset["value"] > 0]
            return success_result(_assets)
        if request.method == "POST":
            return success_result(create())
    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@assets.route("/assets/<string:_id>", methods=["GET", "PUT"])
def _asset(_id: str):
    try:
        if request.method == "GET":
            # TODO: if does not exist send back 400 error
            return success_result(Assets.get(_id))

        if request.method == "PUT":
            asset = request.json
            assign(
                asset,
                {
                    "value": float(asset["value"]),
                    "invested": float(asset["invested"]),
                    "price": float(asset["price"]),
                    "shares": float(asset["shares"]),
                },
            )

            if get(asset, "type") == "stock" or get(asset, "type") == "crypto":
                value = get(asset, "price") * get(asset, "shares")
            else:
                value = float(asset["value"])

            asset["value"] = value
            Assets.update(asset)
            return success_result(Assets.get(asset["_id"]))

    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@assets.route("/assets/<string:_id>/sell", methods=["PUT"])
def _sell(_id: str):
    try:
        payload = request.json
        asset = Assets.get(_id)
        source = payload["source"]
        shares_sold = float(payload["shares"])
        sell_price = float(payload["price"])
        sell_value = shares_sold * sell_price

        asset["shares"] = asset["shares"] - shares_sold
        asset["invested"] = asset["invested"] - sell_value
        asset["value"] = asset["shares"] * asset["price"]

        Assets.update(asset)

        new_income = {
            "date": datetime.now(),
            "amount": sell_value,
            "type": "sale",
            "source": source,
            "asset": _id,
            "deductions": {},
            "description": f"sold {shares_sold} shares of {asset['name']}",
        }

        print(f"new_income: {new_income}")

        new_income = Incomes.get(Incomes.create(new_income).inserted_id)

        return success_result(
            {"updated_asset": Assets.get(_id), "new_income": new_income}
        )

    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


@assets.route("/assets/<string:_id>/buy", methods=["PUT"])
def _buy(_id: str):
    try:
        payload = request.json
        asset = Assets.get(_id)
        vendor = payload["vendor"]
        shares_bought = float(payload["shares"])
        buy_price = float(payload["price"])
        buy_value = shares_bought * buy_price

        asset["shares"] = asset["shares"] + shares_bought
        asset["invested"] = asset["invested"] + buy_value
        asset["value"] = asset["shares"] * asset["price"]

        Assets.update(asset)

        # generate expense
        new_expense = {
            "date": datetime.now(),
            "amount": buy_value,
            "type": "asset",
            "vendor": vendor,
            "asset": _id,
            "description": f"bought {shares_bought} shares of {asset['name']}",
        }
        new_expense = Expenses.get(Expenses.create(new_expense).inserted_id)

        return success_result(
            {"updated_asset": Assets.get(_id), "new_expense": new_expense}
        )

    except Exception as err:
        print(f"err: {err}")
        return failure_result("Bad Request")


def create():
    new_asset = request.json
    new_asset["value"] = float(new_asset["value"])
    new_asset["shares"] = float(new_asset["shares"])
    new_asset["price"] = float(new_asset["price"])
    new_asset["invested"] = float(new_asset["invested"])
    new_asset["last_update"] = datetime.now()

    new_asset = Assets.get(Assets.create(new_asset).inserted_id)

    if new_asset["invested"] > 0:
        # create expense
        new_expense = {
            "amount": new_asset["invested"],
            "type": "asset",
            "vendor": new_asset["vendor"],
            "description": "asset purchase",
            "date": datetime.now().replace(hour=12),
        }
        Expenses.create(new_expense)

    return new_asset
