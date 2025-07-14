"""DyanmoDbStack Stack definition"""

import os
from typing import Optional
from aws_cdk import NestedStack, Stack
from aws_cdk import aws_dynamodb as dynamodb


ENV: str = os.getenv("ENV")
APP_ID: str = os.getenv("APP_ID")


class DynamoDBTable:
    """Create a DynamoDB table construct"""

    def __init__(
        self,
        scope,
        item_type: str,
        partition_key: str,
        sort_key: str,
        time_to_live_attribute: Optional[str] = None,
    ) -> None:
        self.id = f"{APP_ID}-{ENV}-{item_type}s"
        print(f"\tDynamoDBTable: {self.id}")

        self.table = dynamodb.Table(
            scope,
            self.id,
            table_name=self.id,
            partition_key=dynamodb.Attribute(
                name=partition_key, type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name=sort_key, type=dynamodb.AttributeType.STRING
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            time_to_live_attribute=time_to_live_attribute,
        )

    def add_gsi(self, type_: str, partition_key: str, sort_key: str):
        print(
            f"\tDynamoDBTable.GSI: {self.table.to_string().split('/')[-1]} :: {partition_key}/{sort_key}"
        )

        self.table.add_global_secondary_index(
            index_name=f"{APP_ID}-{ENV}-{type_}s-{partition_key}-index",
            partition_key=dynamodb.Attribute(
                name=partition_key, type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(
                name=sort_key, type=dynamodb.AttributeType.STRING
            ),
            projection_type=dynamodb.ProjectionType.ALL,
        )


class DyanmoDbStack(NestedStack):
    """Stack for DynamoDB resources"""

    def __init__(self, scope: Stack) -> None:
        self.id = f"{APP_ID}-{ENV}-dynamdb-stack"
        print(f"DynamoDBStack: {self.id}")
        super().__init__(scope, self.id)

        DynamoDBTable(self, "account", "user_id", "account_id")
        DynamoDBTable(self, "purchase", "user_id", "purchase_id")
        DynamoDBTable(self, "sale", "user_id", "sale_id")
        DynamoDBTable(self, "borrow", "user_id", "borrow_id")
        DynamoDBTable(self, "recurring", "user_id", "recurring_id")
        DynamoDBTable(self, "repayment", "user_id", "repayment_id")
        DynamoDBTable(self, "security", "user_id", "security_id")
        DynamoDBTable(self, "transfer", "user_id", "transfer_id")
        history_table = DynamoDBTable(self, "history", "item_id", "month")
        history_table.add_gsi("history", "user_id", "month")

        DynamoDBTable(self, "expense", "user_id", "expense_id")
        DynamoDBTable(self, "categories", "user_id", "category_type")
        DynamoDBTable(self, "income", "user_id", "income_id")
        DynamoDBTable(self, "paycheck", "user_id", "paycheck_id")
        DynamoDBTable(self, "user", "user_id", "email")
        DynamoDBTable(self, "budget", "user_id", "month")
        DynamoDBTable(self, "audit", "user_id", "timestamp", "ttl")
