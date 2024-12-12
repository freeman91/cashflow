"""DyanmoDbStack Stack definition"""

import os
from aws_cdk import NestedStack, Stack
from aws_cdk import aws_dynamodb as dynamodb


ENV: str = os.getenv("ENV")
APP_ID: str = os.getenv("APP_ID")


class DynamoDBTable:
    """Create a DynamoDB table construct"""

    def __init__(
        self, scope, item_type: str, partition_key: str, sort_key: str
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
        )

    def add_gsi(self, attr: str):
        print(f"\tDynamoDBTable.GSI: {self.table.table_name}{attr}")

        self.table.add_global_secondary_index(
            index_name=f"{APP_ID}-{ENV}-gsi-{attr}",
            partition_key=dynamodb.Attribute(
                name="user_id", type=dynamodb.AttributeType.STRING
            ),
            sort_key=dynamodb.Attribute(name=attr, type=dynamodb.AttributeType.STRING),
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
        DynamoDBTable(self, "asset", "user_id", "asset_id")
        DynamoDBTable(self, "bill", "user_id", "bill_id")
        DynamoDBTable(self, "borrow", "user_id", "borrow_id")
        DynamoDBTable(self, "repayment", "user_id", "repayment_id")
        DynamoDBTable(self, "debt", "user_id", "debt_id")
        DynamoDBTable(self, "expense", "user_id", "expense_id")
        DynamoDBTable(self, "categories", "user_id", "category_type")
        DynamoDBTable(self, "income", "user_id", "income_id")
        DynamoDBTable(self, "networth", "user_id", "networth_id")
        DynamoDBTable(self, "option_list", "user_id", "option_type")
        DynamoDBTable(self, "paycheck", "user_id", "paycheck_id")
        DynamoDBTable(self, "user", "user_id", "email")
        DynamoDBTable(self, "budget", "user_id", "budget_id")

        # expense_table.add_gsi("date")
