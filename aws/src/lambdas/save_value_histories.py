"""Lambda handler for saving value histories"""

from datetime import datetime, timezone
from zoneinfo import ZoneInfo
from pydash import find_index, sort_by

from services.dynamo import Account, Security
from services.dynamo.history import History, ValueItem
from services.api.controllers.__util__ import log_action


def update_or_create_history(
    month_str: str, item_id: str, user_id: str, account_type: str, value_item: dict
):
    print(
        f"update_or_create_history :: {account_type} :: {item_id} :: {user_id} :: {value_item}"
    )
    history = History.get_(item_id, month_str)
    if history:
        idx = find_index(history.values, lambda v: v["date"] == value_item["date"])
        if idx > -1:
            history.values[idx] = value_item
        else:
            history.values.append(value_item)

        history.values = sort_by(history.values, "date")
        history.last_update = datetime.now(timezone.utc)
        history.save()
    else:
        History.create(item_id, month_str, account_type, user_id, [value_item])


def handler(event, context):
    """
    Lambda handler for saving value histories
    Original schedule: 50 10,23 * * * (10:50 AM and 11:50 PM daily)
    """
    try:
        utc_now = datetime.now(timezone.utc)
        ny_time = utc_now.astimezone(ZoneInfo("America/New_York"))

        month_str = ny_time.strftime("%Y-%m")
        date_str = ny_time.strftime("%Y-%m-%d")

        print(f"Update Value Histories :: {ny_time}")

        accounts = Account.scan(Account.active == True)
        securities = Security.scan(Security.active == True)

        for account in accounts:
            value = None
            if account.value is not None:
                value = account.value
            elif account.amount is not None:
                value = account.amount
            elif account.balance is not None:
                value = account.balance

            value_item = ValueItem(date=date_str, value=value)
            update_or_create_history(
                month_str,
                account.account_id,
                account.user_id,
                account.account_type,
                value_item,
            )

        for security in securities:
            if security.shares > 0:
                value = round(security.shares * security.price)
                value_item = ValueItem(
                    date=date_str,
                    value=value,
                    shares=security.shares,
                    price=security.price,
                )

                update_or_create_history(
                    month_str,
                    security.security_id,
                    security.user_id,
                    "Asset",
                    value_item,
                )

        message = "Value Histories created/updated successfully"
        log_action("SYSTEM", message)
        return {"statusCode": 200, "body": message}

    except Exception as e:
        print(f"Error saving value histories: {str(e)}")
        return {"statusCode": 500, "body": f"Error: {str(e)}"}
