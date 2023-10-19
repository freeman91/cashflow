"""Account pynamodb model"""

import os

# from datetime import datetime, timezone
from pynamodb.models import Model
from pynamodb.attributes import UnicodeAttribute, UTCDateTimeAttribute


TYPE = "account"
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
APP_ID: str = os.getenv("APP_ID")


class Account(Model):
    class Meta:
        table_name = f"{APP_ID}-{ENV}-{TYPE}s"
        region = REGION

    user_id = UnicodeAttribute(hash_key=True)
    account_id = UnicodeAttribute(range_key=True)
    _type = UnicodeAttribute(default=TYPE)

    name = UnicodeAttribute()
    url = UnicodeAttribute()
    last_update = UTCDateTimeAttribute()

    def __repr__(self):
        return f"Account<{self.user_id}, {self.name}>"

    def __str__(self):
        # TODO: return pformat(self.as_dict())
        ...

    # def save(self):
    # TODO: overwrite save(), update last_update attr everytime
    #     self.last_update = datetime.now().astimezone(timezone.utc)
    #     super().save()
