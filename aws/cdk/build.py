"""Initiate the root of the CDK construct tree. App entry point"""

import os
from aws_cdk import App, Stack
from aws_cdk import aws_lambda as lambda_
from stacks.db_stack import DyanmoDbStack
from stacks.cronjobs_stack import CronjobsStack
from stacks.__util__ import get_layer_path

# from stacks.api_stack import ApiGatewayStack

AWS_PROFILE: str = os.getenv("AWS_PROFILE")
REGION: str = os.getenv("REGION")
ENV: str = os.getenv("ENV")
APP_ID: str = os.getenv("APP_ID")


class RootStack(Stack):
    def __init__(self, scope: Stack) -> None:
        self.id = f"{APP_ID}-{ENV}-root-stack"
        print(f"RootStack: {self.id}")
        super().__init__(scope, self.id)

        # Create shared Lambda layer, role, and config
        self.lambda_layer = self._create_lambda_layer()

        DyanmoDbStack(self)
        CronjobsStack(self)
        # ApiGatewayStack(self, self.lambda_layer)

    def _create_lambda_layer(self) -> lambda_.LayerVersion:
        """Create a shared Lambda layer with common dependencies"""

        layer_name = f"{APP_ID}-{ENV}-lambda-layer"
        layer = lambda_.LayerVersion(
            self,
            layer_name,
            layer_version_name=layer_name,
            description=f"Shared Lambda layer for {APP_ID} {ENV} environment",
            code=lambda_.Code.from_asset(get_layer_path()),
            compatible_runtimes=[lambda_.Runtime.PYTHON_3_12],
            compatible_architectures=[lambda_.Architecture.X86_64],
        )

        print(f"\tLambda Layer: ", layer_name)
        return layer


if __name__ == "__main__":
    print("Environment Variables:")
    print(f"AWS_PROFILE: {AWS_PROFILE}")
    print(f"REGION: {REGION}")
    print(f"ENV: {ENV}")
    print(f"APP_ID: {APP_ID}")

    app = App()
    RootStack(app)
    app.synth()
