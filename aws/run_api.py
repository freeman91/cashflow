"""init API"""

from flask import Flask, jsonify
from flask_cors import CORS

from services.api import controllers


class Config:
    DEBUG = True


def blueprints(app):
    app.register_blueprint(controllers.accounts.accounts)
    app.register_blueprint(controllers.borrows.borrows)
    app.register_blueprint(controllers.budgets.budgets)
    app.register_blueprint(controllers.categories.categories)
    app.register_blueprint(controllers.cronjobs.cronjobs)
    app.register_blueprint(controllers.expenses.expenses)
    app.register_blueprint(controllers.histories.histories)
    app.register_blueprint(controllers.incomes.incomes)
    app.register_blueprint(controllers.paychecks.paychecks)
    app.register_blueprint(controllers.purchases.purchases)
    app.register_blueprint(controllers.recurrings.recurrings)
    app.register_blueprint(controllers.repayments.repayments)
    app.register_blueprint(controllers.sales.sales)
    app.register_blueprint(controllers.securities.securities)
    app.register_blueprint(controllers.users.users)
    return app


def main():
    app = Flask("cashflow-api")
    CORS(app)

    app.config.from_object(Config)

    @app.route("/")
    def index():
        payload = {"result": "success"}
        return jsonify(payload)

    @app.route("/site-map")
    def site_map():
        return jsonify(list(map(lambda x: x.rule, app.url_map.iter_rules())))

    app = blueprints(app)

    app.run(host="0.0.0.0", port=9000)
