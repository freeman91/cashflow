"""ApiGatewayStack Stack definition"""

import os
from aws_cdk import NestedStack, Stack, Duration
from aws_cdk import aws_apigateway as apigateway
from aws_cdk import aws_lambda as lambda_
from aws_cdk import aws_iam as iam
from aws_cdk import aws_logs as logs


ENV: str = os.getenv("ENV")
APP_ID: str = os.getenv("APP_ID")


class ApiGatewayStack(NestedStack):
    """Stack for API Gateway and Lambda resources"""

    def __init__(self, scope: Stack, lambda_layer: lambda_.LayerVersion) -> None:
        self.id = f"{APP_ID}-{ENV}-api-stack"
        print(f"ApiGatewayStack: {self.id}")
        super().__init__(scope, self.id)

        self.lambda_layer = lambda_layer

        # Create Lambda function
        lambda_function = self._create_lambda_function()

        # Create API Gateway
        api_gateway = self._create_api_gateway()

        # Create API resources and methods
        self._create_api_resources(api_gateway, lambda_function)

    def _create_lambda_function(self) -> lambda_.Function:
        """Create the Lambda function for handling API requests"""

        # Create Lambda execution role
        lambda_role = iam.Role(
            self,
            f"{APP_ID}-{ENV}-lambda-role",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                )
            ],
        )

        # Create Lambda function
        lambda_function = lambda_.Function(
            self,
            f"{APP_ID}-{ENV}-api-handler",
            runtime=lambda_.Runtime.PYTHON_3_12,
            handler="main.handler",
            code=lambda_.Code.from_inline(
                """
import main

def handler(event, context):
    return main.handler(event, context)
"""
            ),
            role=lambda_role,
            timeout=Duration.seconds(30),
            memory_size=256,
            layers=[self.lambda_layer],
            environment={"ENV": ENV, "APP_ID": APP_ID},
            log_retention=logs.RetentionDays.ONE_YEAR,
        )

        print(f"\tLambda Function: {lambda_function.function_name}")
        return lambda_function

    def _create_api_gateway(self) -> apigateway.RestApi:
        """Create the API Gateway REST API"""

        api = apigateway.RestApi(
            self,
            f"{APP_ID}-{ENV}-api",
            rest_api_name=f"{APP_ID}-{ENV}-api",
            description=f"REST API for {APP_ID} {ENV} environment",
            default_cors_preflight_options=apigateway.CorsOptions(
                allow_origins=apigateway.Cors.ALL_ORIGINS,
                allow_methods=apigateway.Cors.ALL_METHODS,
                allow_headers=["*"],
            ),
            deploy_options=apigateway.StageOptions(
                stage_name=ENV,
                logging_level=apigateway.MethodLoggingLevel.INFO,
                data_trace_enabled=True,
            ),
        )

        print(f"\tAPI Gateway: {api.rest_api_name}")
        return api

    def _create_api_resources(
        self, api: apigateway.RestApi, lambda_function: lambda_.Function
    ) -> None:
        """Create API resources and methods"""

        # Create Lambda integration
        lambda_integration = apigateway.LambdaIntegration(
            lambda_function,
            request_templates={"application/json": '{ "statusCode": "200" }'},
        )

        # Create root resource
        root_resource = api.root

        # Add methods to root resource
        root_resource.add_method("GET", lambda_integration)
        root_resource.add_method("POST", lambda_integration)

        # Create /api resource
        api_resource = api.root.add_resource("api")

        # Add methods to /api resource
        api_resource.add_method("GET", lambda_integration)
        api_resource.add_method("POST", lambda_integration)

        # Create /api/v1 resource
        v1_resource = api_resource.add_resource("v1")

        # Add methods to /api/v1 resource
        v1_resource.add_method("GET", lambda_integration)
        v1_resource.add_method("POST", lambda_integration)

        # Create specific endpoints
        users_resource = v1_resource.add_resource("users")
        users_resource.add_method("GET", lambda_integration)
        users_resource.add_method("POST", lambda_integration)

        # Add user ID resource
        user_id_resource = users_resource.add_resource("{user_id}")
        user_id_resource.add_method("GET", lambda_integration)
        user_id_resource.add_method("PUT", lambda_integration)
        user_id_resource.add_method("DELETE", lambda_integration)

        # Create transactions endpoint
        transactions_resource = v1_resource.add_resource("transactions")
        transactions_resource.add_method("GET", lambda_integration)
        transactions_resource.add_method("POST", lambda_integration)

        # Add transaction ID resource
        transaction_id_resource = transactions_resource.add_resource("{transaction_id}")
        transaction_id_resource.add_method("GET", lambda_integration)
        transaction_id_resource.add_method("PUT", lambda_integration)
        transaction_id_resource.add_method("DELETE", lambda_integration)

        print(f"\tAPI Resources created with Lambda integration")
