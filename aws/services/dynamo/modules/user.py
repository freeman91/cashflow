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


def get(user_id: str = None) -> User:
    if user_id:
        return next(User.query(user_id))

    return list(User.scan())
