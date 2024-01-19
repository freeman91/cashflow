from services.dynamo.models.categories import Categories


def create(
    user_id: str,
    category_type: str,
    categories: list,
) -> Categories:
    categories = Categories(
        user_id=user_id,
        category_type=category_type,
        categories=categories,
    )
    categories.save()
    return categories


def get(user_id: str = None, category_type: str = None) -> Categories:
    if user_id and category_type:
        return Categories.get(user_id, category_type)

    if user_id:
        return list(Categories.query(user_id))

    return list(Categories.scan())
