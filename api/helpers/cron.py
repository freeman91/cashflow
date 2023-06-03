# pylint: disable= missing-function-docstring

"""helpers.cron submodule"""

from datetime import date


def decode_cron_rule(cron_expression: str):
    cron_parts = cron_expression.split()
    day_of_month = cron_parts[0]
    month = cron_parts[1]
    return day_of_month, month


def is_cron_match(cron_expression: str, target_date: date):
    day_of_month, month = decode_cron_rule(cron_expression)

    if day_of_month != "*" and target_date.day != int(day_of_month):
        return False

    if month != "*" and target_date.month != int(month):
        return False

    return True
