# pylint: disable=missing-function-docstring
"""Flask API"""

import logging

from flask import Flask, jsonify, url_for
from flask_meter import FlaskMeter
from flask_cors import CORS

from api.controllers.users import users

from api.controllers.expenses import expenses
from api.controllers.incomes import incomes
from api.controllers.bills import bills
from api.controllers.goals import goals
from api.controllers.assets import assets
from api.controllers.debts import debts
from api.controllers.accounts import accounts
from api.controllers.networths import networths
from api.controllers.cronjobs import cronjobs

from api.config import AppConfig

flask_meter = FlaskMeter()

__version__ = "0.0.1"


def has_no_empty_params(rule):
    defaults = rule.defaults if rule.defaults is not None else ()
    arguments = rule.arguments if rule.arguments is not None else ()
    return len(defaults) >= len(arguments)


def create_app():
    app = Flask(__name__)
    CORS(app)

    logger = logging.getLogger()
    logger.setLevel(AppConfig.LOG_LEVEL)

    app.config.from_object(AppConfig)

    flask_meter.init_app(app)

    app.register_blueprint(users)
    app.register_blueprint(expenses)
    app.register_blueprint(incomes)
    app.register_blueprint(bills)
    app.register_blueprint(goals)
    app.register_blueprint(assets)
    app.register_blueprint(debts)
    app.register_blueprint(accounts)
    app.register_blueprint(networths)
    app.register_blueprint(cronjobs)

    @app.route("/")
    def index():
        payload = {"result": "success"}
        return jsonify(payload)

    @app.route("/site-map")
    def site_map():
        links = []
        for rule in app.url_map.iter_rules():
            # Filter out rules we can't navigate to in a browser
            # and rules that require parameters
            if has_no_empty_params(rule):
                url = url_for(rule.endpoint, **(rule.defaults or {}))
                links.append((url, rule.endpoint))
        # links is now a list of url, endpoint tuples\

        return jsonify(links)

    return app
