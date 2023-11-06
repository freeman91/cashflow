"""Initiate the root of the CDK construct tree. App entry point"""

import os
from aws_cdk import App, Stack
from stacks.db_stack import DyanmoDbStack

AWS_PROFILE: str = os.getenv("AWS_PROFILE")
REGION: str = os.getenv("REGION")
ENV: str = os.getenv("ENV")
APP_ID: str = os.getenv("APP_ID")


class RootStack(Stack):
    def __init__(self, scope: Stack) -> None:
        self.id = f"{APP_ID}-{ENV}-root-stack"
        print(f"RootStack: {self.id}")
        super().__init__(scope, self.id)

        DyanmoDbStack(self)


if __name__ == "__main__":
    print("Environment Variables:")
    print(f"AWS_PROFILE: {AWS_PROFILE}")
    print(f"REGION: {REGION}")
    print(f"ENV: {ENV}")
    print(f"APP_ID: {APP_ID}")

    app = App()
    RootStack(app)
    app.synth()
