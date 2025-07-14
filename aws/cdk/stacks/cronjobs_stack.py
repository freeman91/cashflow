"""CronjobsStack Stack definition"""

import os
from aws_cdk import NestedStack, Stack, Duration
from aws_cdk import aws_lambda as lambda_
from aws_cdk import aws_iam as iam
from aws_cdk import aws_logs as logs
from aws_cdk import aws_events as events
from aws_cdk import aws_events_targets as targets
from aws_cdk import aws_ssm as ssm
from stacks.__util__ import get_top_level_path

ENV: str = os.getenv("ENV")
APP_ID: str = os.getenv("APP_ID")
REGION: str = os.getenv("REGION")


class CronjobsStack(NestedStack):
    """Stack for EventBridge rules and Lambda functions for cronjobs"""

    def __init__(self, scope: Stack, lambda_layer: lambda_.LayerVersion) -> None:
        self.id = f"{APP_ID}-{ENV}-cronjobs-stack"
        print(f"CronjobsStack: {self.id}")
        super().__init__(scope, self.id)

        self.lambda_layer = lambda_layer

        # Create Lambda functions for each cronjob
        self._create_cronjob_functions()

        # Create EventBridge rules
        self._create_eventbridge_rules()

    def _create_cronjob_functions(self) -> None:
        """Create Lambda functions for each cronjob"""

        # Create Lambda execution role with necessary permissions
        lambda_role = iam.Role(
            self,
            f"{APP_ID}-{ENV}-cronjobs-lambda-role",
            assumed_by=iam.ServicePrincipal("lambda.amazonaws.com"),
            managed_policies=[
                iam.ManagedPolicy.from_aws_managed_policy_name(
                    "service-role/AWSLambdaBasicExecutionRole"
                )
            ],
        )

        # Add DynamoDB permissions
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "dynamodb:GetItem",
                    "dynamodb:PutItem",
                    "dynamodb:UpdateItem",
                    "dynamodb:DeleteItem",
                    "dynamodb:Query",
                    "dynamodb:Scan",
                ],
                resources=[f"arn:aws:dynamodb:*:*:table/{APP_ID}-{ENV}-*"],
            )
        )

        # Add SSM Parameter Store permissions
        lambda_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=[
                    "ssm:GetParameter",
                    "ssm:GetParameters",
                ],
                resources=[
                    f"arn:aws:ssm:*:*:parameter/alpha-vantage/api-key",
                    f"arn:aws:ssm:*:*:parameter/crypto-compare/api-key",
                ],
            )
        )

        # Common Lambda configuration
        common_config = {
            "runtime": lambda_.Runtime.PYTHON_3_12,
            "role": lambda_role,
            "timeout": Duration.seconds(300),  # 5 minutes for cronjobs
            "memory_size": 512,
            "layers": [self.lambda_layer],
            "environment": {
                "ENV": ENV,
                "APP_ID": APP_ID,
                "REGION": REGION,
                "ALPHAVANTAGE_PARAM_NAME": "/alpha-vantage/api-key",
                "CRYPTO_COMPARE_PARAM_NAME": "/crypto-compare/api-key",
            },
            "code": lambda_.Code.from_asset(
                os.path.join(get_top_level_path(), "aws/src")
            ),
        }

        # Create Lambda function for update_crypto_prices
        crypto_function_name = f"{APP_ID}-{ENV}-update-crypto-prices"
        self.update_crypto_prices_function = lambda_.Function(
            self,
            crypto_function_name,
            handler="lambdas.update_crypto_prices.handler",
            function_name=f"{APP_ID}-{ENV}-update-crypto-prices",
            log_group=logs.LogGroup(
                self,
                f"{APP_ID}-{ENV}-update-crypto-prices-log-group",
                log_group_name=f"/aws/lambda/{APP_ID}-{ENV}-update-crypto-prices",
                retention=logs.RetentionDays.ONE_MONTH,
            ),
            **common_config,
        )
        print(f"\tLambda Function: {crypto_function_name}")

        # Create Lambda function for update_stock_prices
        stock_function_name = f"{APP_ID}-{ENV}-update-stock-prices"
        self.update_stock_prices_function = lambda_.Function(
            self,
            stock_function_name,
            handler="lambdas.update_stock_prices.handler",
            function_name=f"{APP_ID}-{ENV}-update-stock-prices",
            log_group=logs.LogGroup(
                self,
                f"{APP_ID}-{ENV}-update-stock-prices-log-group",
                log_group_name=f"/aws/lambda/{APP_ID}-{ENV}-update-stock-prices",
                retention=logs.RetentionDays.ONE_MONTH,
            ),
            **common_config,
        )
        print(f"\tLambda Function: {stock_function_name}")

        # Create Lambda function for save_value_histories
        history_function_name = f"{APP_ID}-{ENV}-save-value-histories"
        self.save_value_histories_function = lambda_.Function(
            self,
            history_function_name,
            handler="lambdas.save_value_histories.handler",
            function_name=f"{APP_ID}-{ENV}-save-value-histories",
            log_group=logs.LogGroup(
                self,
                f"{APP_ID}-{ENV}-save-value-histories-log-group",
                log_group_name=f"/aws/lambda/{APP_ID}-{ENV}-save-value-histories",
                retention=logs.RetentionDays.ONE_MONTH,
            ),
            **common_config,
        )
        print(f"\tLambda Function: {history_function_name}")

        # Create Lambda function for generate_transactions
        transactions_function_name = f"{APP_ID}-{ENV}-generate-transactions"
        self.generate_transactions_function = lambda_.Function(
            self,
            transactions_function_name,
            handler="lambdas.generate_transactions.handler",
            function_name=f"{APP_ID}-{ENV}-generate-transactions",
            log_group=logs.LogGroup(
                self,
                f"{APP_ID}-{ENV}-generate-transactions-log-group",
                log_group_name=f"/aws/lambda/{APP_ID}-{ENV}-generate-transactions",
                retention=logs.RetentionDays.ONE_MONTH,
            ),
            **common_config,
        )
        print(f"\tLambda Function: {transactions_function_name}")

    def _create_eventbridge_rules(self) -> None:
        """Create EventBridge rules for each cronjob"""

        # Rule for update_crypto_prices (6:30 AM and 6:30 PM daily)
        crypto_rule_name = f"{APP_ID}-{ENV}-crypto-prices-rule"
        crypto_rule = events.Rule(
            self,
            crypto_rule_name,
            rule_name=crypto_rule_name,
            description="Trigger crypto price updates at 1030 and 2330 UTC daily",
            schedule=events.Schedule.cron(
                minute="30", hour="10,23", day="*", month="*", year="*"
            ),
        )
        crypto_rule.add_target(
            targets.LambdaFunction(self.update_crypto_prices_function)
        )
        print(f"\tEventBridge Rule: {crypto_rule_name}")

        # Rule for update_stock_prices (1800 UTC daily)
        stock_rule_name = f"{APP_ID}-{ENV}-stock-prices-rule"
        stock_rule = events.Rule(
            self,
            stock_rule_name,
            rule_name=stock_rule_name,
            description="Trigger stock price updates at 2330 UTC daily",
            schedule=events.Schedule.cron(
                minute="30", hour="23", day="*", month="*", year="*"
            ),
        )
        stock_rule.add_target(targets.LambdaFunction(self.update_stock_prices_function))
        print(f"\tEventBridge Rule: {stock_rule_name}")

        # Rule for save_value_histories (10:50 AM and 11:50 PM daily)
        history_rule_name = f"{APP_ID}-{ENV}-value-histories-rule"
        history_rule = events.Rule(
            self,
            history_rule_name,
            rule_name=history_rule_name,
            description="Trigger value history saves at 0550 UTC daily",
            schedule=events.Schedule.cron(
                minute="5", hour="5", day="*", month="*", year="*"
            ),
        )
        history_rule.add_target(
            targets.LambdaFunction(self.save_value_histories_function)
        )
        print(f"\tEventBridge Rule: {history_rule_name}")

        # Rule for generate_transactions (midnight daily)
        transactions_rule_name = f"{APP_ID}-{ENV}-generate-transactions-rule"
        transactions_rule = events.Rule(
            self,
            transactions_rule_name,
            rule_name=transactions_rule_name,
            description="Trigger transaction generation at 0510 UTC daily",
            schedule=events.Schedule.cron(
                minute="10", hour="5", day="*", month="*", year="*"
            ),
        )
        transactions_rule.add_target(
            targets.LambdaFunction(self.generate_transactions_function)
        )
        print(f"\tEventBridge Rule: {transactions_rule_name}")
