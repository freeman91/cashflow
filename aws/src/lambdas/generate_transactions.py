"""Lambda handler for generating transactions"""

from datetime import date, timedelta
from pydash import last
from dateutil.rrule import rrule, YEARLY, MONTHLY, WEEKLY

from services.dynamo import Recurring
from .__util__ import log_action

FREQUENCY_MAP = {"yearly": YEARLY, "monthly": MONTHLY, "weekly": WEEKLY}


def handler(event, context):
    """
    Lambda handler for generating transactions
    Original schedule: 0 0 * * * (midnight daily)
    """
    try:
        count = 0
        _date = date.today() + timedelta(days=35)

        print(f"Generating Transactions for :: {_date}")

        for recurring in Recurring.scan(Recurring.active == True):
            if recurring.next_date is None:
                continue

            # Generate transactions for all recurrings where next_date is before the given date
            while recurring.next_date.date() <= _date:
                transaction = recurring.generate(
                    year=recurring.next_date.year,
                    month=recurring.next_date.month,
                    day=recurring.next_date.day,
                )
                print(f"Generating :: {recurring.name} :: {transaction}")

                # Calculate the next occurrence
                next_dates = rrule(
                    FREQUENCY_MAP[recurring.frequency],
                    dtstart=recurring.next_date,
                    interval=recurring.interval,
                    bymonthday=recurring.day_of_month,
                    byweekday=recurring.day_of_week,
                    bymonth=recurring.month_of_year,
                    count=2,
                )
                recurring.next_date = last(next_dates)
                recurring.save()

                print(f"Next Date :: {recurring.name} :: {recurring.next_date}")
                count += 1

        message = f"{_date} :: {count} transactions generated"
        print(message)
        log_action("Generate Transactions", message)
        return {"statusCode": 200, "body": message}

    except Exception as e:
        print(f"Error generating transactions: {str(e)}")
        log_action("Generate Transactions", f"Error: {str(e)}", status="error")
        return {"statusCode": 500, "body": f"Error: {str(e)}"}
