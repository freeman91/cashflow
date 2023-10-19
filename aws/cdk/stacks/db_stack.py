"""DyanmoDbStack Stack definition"""

import os
from aws_cdk import NestedStack, Stack
from aws_cdk import aws_dynamodb as dynamodb


ENV: str = os.getenv("REACT_APP_ENV")
APP_ID: str = os.getenv("APP_ID")


class DynamoDBTable:
    """Create a DynamoDB table construct"""

    def __init__(self, scope, item_type: str, partition_key: str, sort_key: str) -> None:
        name = f"{APP_ID}-{ENV}-{item_type}s"
        dynamodb.Table(
            scope,
            name,
            table_name=name,
            partition_key=dynamodb.Attribute(
                name=partition_key, type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name=sort_key, type=dynamodb.AttributeType.STRING
            ),
        )

class DyanmoDbStack(NestedStack):
    """Stack for DynamoDB resources"""

    def __init__(self, scope: Stack):

        super().__init__(
            scope,
            f"{APP_ID}-{ENV}-dynamodb-stack",
        )

        DynamoDBTable(self, "account", "user_id", "account_id")
        DynamoDBTable(self, "asset_purchase", "user_id", "account_id")
        DynamoDBTable(self, "asset_sale", "user_id", "account_id")
        DynamoDBTable(self, "asset", "user_id", "account_id")
        DynamoDBTable(self, "bill", "user_id", "bill_id")
        DynamoDBTable(self, "debt_acquire", "user_id", "account_id")
        DynamoDBTable(self, "debt_payment", "user_id", "account_id")
        DynamoDBTable(self, "debt", "user_id", "account_id")
        DynamoDBTable(self, "expense", "user_id", "date")
        DynamoDBTable(self, "income", "user_id", "date")
        DynamoDBTable(self, "networth", "user_id", "date")
        DynamoDBTable(self, "paycheck", "user_id", "paycheck_id")
        DynamoDBTable(self, "user", "user_id", "email")
