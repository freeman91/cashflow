# pylint: disable= missing-function-docstring

"""helpers.cron submodule"""

from datetime import date


def decode_cron_rule(cron_expression: str):
    cron_parts = cron_expression.split()
    day_of_month = cron_parts[0]
    month = cron_parts[1]
    return day_of_month, month


def is_cron_match(cron_expression: str, target_date: date):
    day_of_month, months = decode_cron_rule(cron_expression)

    if months != "*":
        months = [int(substring) for substring in months.split(",")]

    if day_of_month != "*" and target_date.day != int(day_of_month):
        return False

    if months != "*" and str((target_date.month)) not in months:
        return False

    return True
