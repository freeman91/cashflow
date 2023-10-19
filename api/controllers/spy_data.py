# pylint: disable=import-error, broad-except
"""SPY data controller"""

import csv
from flask import Blueprint, request

from api.controllers.__util__ import (
    failure_result,
    handle_exception,
    success_result,
)

spy_data = Blueprint("spy_data", __name__)


@handle_exception
@spy_data.route("/spy_data", methods=["GET"])
def _spy_data():
    if request.method == "GET":
        rows = []
        with open("spy-data.csv", "r", encoding="utf-8") as file:
            csvreader = csv.reader(file)
            for idx, line in enumerate(csvreader):
                if idx == 0:
                    continue
                rows.append(
                    {
                        "date": line[0],
                        "close": float(line[4]),
                    }
                )

        # return success_result(rows[-1100:])
        return success_result(rows)

    return failure_result()
