"""SSM Parameter Store utilities"""

import boto3
import os
from typing import Optional


def get_parameter(param_name_env_var: str) -> Optional[str]:
    """
    Retrieve API key from SSM Parameter Store

    Args:
        param_name_env_var: Environment variable name containing the parameter name

    Returns:
        The API key value if successful, None otherwise
    """
    ssm_client = boto3.client("ssm")
    param_name = os.environ.get(param_name_env_var)

    if not param_name:
        print(f"Environment variable {param_name_env_var} not set")
        return None

    try:
        response = ssm_client.get_parameter(
            Name=param_name,
            WithDecryption=True,  # Use this if the parameter is encrypted
        )
        return response["Parameter"]["Value"]
    except Exception as e:
        print(f"Error retrieving API key from {param_name}: {e}")
        return None
