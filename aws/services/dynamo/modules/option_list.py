from services.dynamo.models.option_list import OptionList


def create(
    user_id: str,
    option_type: str,
    options: list,
) -> OptionList:
    option_list = OptionList(
        user_id=user_id,
        option_type=option_type,
        options=options,
    )
    option_list.save()
    return option_list


def get(user_id: str = None, option_type: str = None) -> OptionList:
    if user_id and option_type:
        return OptionList.get(user_id, option_type)

    if user_id:
        return list(OptionList.query(user_id))

    return list(OptionList.scan())
