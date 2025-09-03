import os
import boto3
from datetime import datetime, timedelta
from pprint import pprint

from services.dynamo import Account, Expense, User

SOURCE_EMAIL: str = os.getenv("SOURCE_EMAIL")


def handler(event, context):
    """Lambda handler for daily notification"""

    print("Event: ", event)
    ses = boto3.client("ses")

    responses = []
    users = User.scan()
    for user in users:
        print(user)

        # find pending expenses over the next 3 days
        now = datetime.now()
        start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        end = start + timedelta(days=3)
        pending_expenses = Expense.search(
            user_id=user.user_id,
            start=start,
            end=end,
        )

        # find all unique accounts for the expenses
        account_ids = set()
        for expense in pending_expenses:
            if expense.payment_from_id:
                account_ids.add(expense.payment_from_id)

        # find sum of pending expenses for each account
        account_expenses = {}
        for expense in pending_expenses:
            if expense.payment_from_id:
                account_expenses[expense.payment_from_id] = (
                    account_expenses.get(expense.payment_from_id, 0) + expense.amount
                )

        print("account_expenses")
        pprint(account_expenses)

        # get all accounts
        all_accounts = Account.list(user_id=user.user_id)
        accounts = [
            account for account in all_accounts if account.account_id in account_ids
        ]
        print("accounts")
        pprint(
            [
                {
                    "account_id": account.account_id,
                    "amount": account.amount,
                    "name": account.name,
                    "balance": account.balance,
                }
                for account in accounts
            ]
        )

        # compile the data
        account_overdraw_warnings = []
        for account in accounts:
            if (
                account.balance is not None
                and account.balance < account_expenses[account.account_id]
            ):
                account_overdraw_warnings.append(
                    f"{account.name} has insufficient funds to cover all expenses in the next 3 days. Overdraw amount: ${account_expenses[account.account_id] - account.amount}"
                )

        lines = [
            *[
                f"{expense.merchant} - ${expense.amount:.2f} - {expense.date.strftime('%Y-%m-%d')}"
                for expense in pending_expenses
            ],
            *[f"{warning}" for warning in account_overdraw_warnings],
        ]
        body_text = "\n".join(lines)

        # send the notification
        response = ses.send_email(
            Source=SOURCE_EMAIL,
            Destination={"ToAddresses": [user.email]},
            Message={
                "Subject": {"Data": "Your Daily Report"},
                "Body": {
                    "Text": {
                        "Data": body_text,
                        "Charset": "UTF-8",
                    },
                },
            },
        )
        responses.append(response)

    return {
        "statusCode": 200,
        "body": responses,
    }
