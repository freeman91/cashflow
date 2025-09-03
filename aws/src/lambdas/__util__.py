"""lambda utility functions"""

from services.dynamo import Audit


def log_action(lambda_name: str, message: str, status: str = "success"):
    Audit.create(
        user_id="SYSTEM",
        action=f"CRONJOB - {lambda_name}",
        status=status,
        message=message,
    )
