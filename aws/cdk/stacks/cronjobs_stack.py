"""CronjobsStack Stack definition"""

import os
from aws_cdk import NestedStack, Stack, Duration
from aws_cdk import aws_lambda as lambda_
from aws_cdk import aws_iam as iam
from aws_cdk import aws_logs as logs
from aws_cdk import aws_events as events
from aws_cdk import aws_events_targets as targets
from stacks.__util__ import get_top_level_path

ENV: str = os.getenv("ENV")
APP_ID: str = os.getenv("APP_ID")
REGION: str = os.getenv("REGION")
SOURCE_EMAIL: str = os.getenv("SOURCE_EMAIL")


class CronjobsStack(NestedStack):
    """Stack for EventBridge rules and Lambda functions for cronjobs"""

    def __init__(self, scope: Stack) -> None:
        self.id = f"{APP_ID}-{ENV}-cronjobs-stack"
        print(f"CronjobsStack: {self.id}")
        super().__init__(scope, self.id)

        self.lambda_role = self._create_lambda_role()
        self.common_lambda_config = self._create_lambda_config(scope)

        # Create Lambda functions for each cronjob
        self._create_cronjob_functions(scope)

        # Create EventBridge rules
        self._create_eventbridge_rules()

    def _create_lambda_config(self, scope: Stack) -> dict:
        """Create a common Lambda configuration"""

        return {
            "runtime": lambda_.Runtime.PYTHON_3_12,
            "role": self.lambda_role,
            "timeout": Duration.seconds(300),  # 5 minutes for cronjobs
            "memory_size": 512,
            "layers": [scope.lambda_layer],
            "environment": {
                "ENV": ENV,
                "APP_ID": APP_ID,
                "REGION": REGION,
                "SOURCE_EMAIL": SOURCE_EMAIL,
                "ALPHAVANTAGE_PARAM_NAME": "/alpha-vantage/api-key",
                "CRYPTO_COMPARE_PARAM_NAME": "/crypto-compare/api-key",
            },
            "code": lambda_.Code.from_asset(
                os.path.join(get_top_level_path(), "aws/src")
            ),
        }

    def _create_lambda_role(self) -> iam.Role:
        """Create a Lambda execution role with necessary permissions"""

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

        lambda_role.add_to_policy(
            iam.PolicyStatement(
                effect=iam.Effect.ALLOW,
                actions=["ses:SendEmail"],
                resources=["arn:aws:ses:*:*:identity/*"],
            )
        )

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
        return lambda_role

    def _create_cronjob_functions(self, scope: Stack) -> None:
        """Create Lambda functions for each cronjob"""

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
            **self.common_lambda_config,
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
            **self.common_lambda_config,
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
            **self.common_lambda_config,
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
            **self.common_lambda_config,
        )
        print(f"\tLambda Function: {transactions_function_name}")

        # Create Lambda function for daily_user_email
        daily_user_email_name = f"{APP_ID}-{ENV}-daily-user-email"
        self.daily_user_email = lambda_.Function(
            self,
            daily_user_email_name,
            handler="lambdas.daily_notification.handler",
            function_name=daily_user_email_name,
            log_group=logs.LogGroup(
                self,
                f"{APP_ID}-{ENV}-daily-notification-log-group",
                log_group_name=f"/aws/lambda/{APP_ID}-{ENV}-daily-notification",
                retention=logs.RetentionDays.ONE_MONTH,
            ),
            **self.common_lambda_config,
        )
        print(f"\tLambda Function: {daily_user_email_name}")

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

        # Rule for daily_user_email (12:00 UTC daily)
        daily_user_email_rule_name = f"{APP_ID}-{ENV}-daily-user-email-rule"
        daily_user_email_rule = events.Rule(
            self,
            daily_user_email_rule_name,
            rule_name=daily_user_email_rule_name,
            description="Trigger daily user email at 12:00 UTC daily",
            schedule=events.Schedule.cron(minute="0", hour="12"),  # 12:00 UTC
        )
        daily_user_email_rule.add_target(targets.LambdaFunction(self.daily_user_email))
        print(f"\tEventBridge Rule: {daily_user_email_rule_name}")
