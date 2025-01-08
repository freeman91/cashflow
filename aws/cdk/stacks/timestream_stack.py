"""TimestreamStack class definition"""

import os
from aws_cdk import NestedStack, Stack, RemovalPolicy
from aws_cdk import aws_kms as kms
from aws_cdk import aws_timestream as timestream

APP_ID: str = os.getenv("APP_ID")
ENV: str = os.getenv("ENV")
MEM_STORE_DURATION = 720  # 30 days
MAG_STORE_DURATION = 73000  # 200 years


class TimestreamStack(NestedStack):
    """Constructs Timestream DB and table"""

    def __init__(
        self,
        scope: Stack,
    ) -> None:
        self.stack = "timestream"
        self.id = f"{APP_ID}-{ENV}-{self.stack}-stack"
        print(f"TimestreamStack: {self.id}")
        super().__init__(scope, self.id)

        key_name = f"{APP_ID}-{ENV}-kms-key"
        kms_key = kms.Key(
            self, key_name, alias=key_name, removal_policy=RemovalPolicy.DESTROY
        )
        print("\tKMS Key")

        database_name = f"{APP_ID}-{ENV}-timestream-db"
        table_name = f"{APP_ID}-{ENV}-entity-value-table"

        self.timestream_db = timestream.CfnDatabase(
            self,
            database_name,
            database_name=database_name,
            kms_key_id=kms_key.key_id,
        )
        self.timestream_table = timestream.CfnTable(
            self,
            table_name,
            table_name=table_name,
            database_name=self.timestream_db.database_name,
            magnetic_store_write_properties={"EnableMagneticStoreWrites": True},
            retention_properties={
                "MemoryStoreRetentionPeriodInHours": MEM_STORE_DURATION,
                "MagneticStoreRetentionPeriodInDays": MAG_STORE_DURATION,
            },
        )
        self.timestream_table.add_dependency(self.timestream_db)
        print(f"\tTimestream Database: {self.timestream_db.database_name}")
        print(f"\tTimestream Table: {self.timestream_table.table_name}")
