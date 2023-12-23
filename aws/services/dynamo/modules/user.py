from uuid import uuid4
import bcrypt


from services.dynamo.models.user import User


def create(email: str, name: str, password: str) -> User:
    user = User(
        user_id=f"user:{uuid4()}",
        email=email,
        name=name,
        password=bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()),
    )
    user.save()
    return user


def update(user_id: str, body: dict) -> User:
    user = get(user_id=user_id)

    paycheck_defaults = body.get("paycheck_defaults")

    for attr in ["employer", "take_home", "taxes", "retirement", "benefits", "other"]:
        setattr(user.paycheck_defaults, attr, paycheck_defaults.get(attr))

    user.save()
    return user


def get(user_id: str = None) -> User:
    if user_id:
        return next(User.query(user_id))

    return list(User.scan())
