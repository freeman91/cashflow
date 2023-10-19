"""RootStack definition"""

import os
from aws_cdk import App, Stack

from .db_stack import DynamoDBStack

APP_ID: str = os.getenv("APP_ID")
ENV: str = os.getenv("ENV")
REGION: str = os.getenv("REGION")
# AWS_ACCOUNT_ID: str = os.getenv("AWS_ACCOUNT_ID")

class RootStack(Stack):
    def __init__(self, scope: App) -> None:
        super().__init__(
                scope,
                id=f"{APP_ID}-{ENV}-root-stack",
                # env=Environment(region=REGION, account=AWS_ACCOUNT_ID),
                tags={"app": f"{APP_ID}", "env": ENV},
            )
        DynamoDBStack(self)
