import logging
import os

from flask import Flask, jsonify, request
from flask_meter import FlaskMeter
from flask_cors import CORS

from api.controllers.users import users
from api.controllers.expenses import expenses
from api.controllers.incomes import incomes
from api.controllers.hours import hours
from api.controllers.goals import goals
from api.controllers.assets import assets
from api.controllers.debts import debts
from api.controllers.networths import networths

from api.config import app_config
from api.db import database

flask_meter = FlaskMeter()


def create_app():
    app = Flask(__name__)
    CORS(app)

    logger = logging.getLogger()
    logger.setLevel(app_config.LOG_LEVEL)

    app.config.from_object(app_config)

    flask_meter.init_app(app)

    app.register_blueprint(users)
    app.register_blueprint(expenses)
    app.register_blueprint(incomes)
    app.register_blueprint(hours)
    app.register_blueprint(goals)
    app.register_blueprint(assets)
    app.register_blueprint(debts)
    app.register_blueprint(networths)

    @app.route("/")
    def index():
        payload = {"result": "success"}
        return jsonify(payload)

    @app.route("/_health")
    def health():
        payload = {"result": "success"}
        return jsonify(payload)

    return app
