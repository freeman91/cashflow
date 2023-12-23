from uuid import uuid4

from services.dynamo.models.account import Account


def create(
    user_id: str, name: str, account_type: str, url: str = None, description: str = None
) -> Account:
    account = Account(
        user_id=user_id,
        account_id=f"account:{uuid4()}",
        name=name,
        url=url,
        account_type=account_type,
    )
    account.save()
    return account


def get(user_id: str = None, account_id: str = None) -> Account:
    if user_id and account_id:
        return Account.get(user_id, account_id)

    if user_id:
        return list(Account.query(user_id))

    return list(Account.scan())
