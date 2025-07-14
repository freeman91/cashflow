"""Lambda handler for API Gateway requests"""

import json
import os
from typing import Dict, Any


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Lambda handler function for API Gateway requests

    Args:
        event: API Gateway event
        context: Lambda context

    Returns:
        API Gateway response
    """

    # Extract request information
    http_method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    path_parameters = event.get("pathParameters", {})
    query_parameters = event.get("queryStringParameters", {})
    body = event.get("body", "{}")

    # Parse body if it's a string
    if isinstance(body, str):
        try:
            body = json.loads(body)
        except json.JSONDecodeError:
            body = {}

    # Log request details
    print(f"Request: {http_method} {path}")
    print(f"Path Parameters: {path_parameters}")
    print(f"Query Parameters: {query_parameters}")
    print(f"Body: {body}")

    # Basic routing logic
    if path == "/":
        return _handle_root(http_method, body)
    elif path.startswith("/api"):
        return _handle_api(http_method, path, path_parameters, query_parameters, body)
    else:
        return _create_response(404, {"error": "Not Found"})

    return _create_response(200, {"message": "Hello from Lambda!"})


def _handle_root(http_method: str, body: Dict[str, Any]) -> Dict[str, Any]:
    """Handle requests to the root path"""

    if http_method == "GET":
        return _create_response(
            200,
            {
                "message": "CashFlow API",
                "version": "1.0.0",
                "environment": os.getenv("ENV", "unknown"),
                "app_id": os.getenv("APP_ID", "unknown"),
            },
        )
    elif http_method == "POST":
        return _create_response(
            200, {"message": "Root POST endpoint", "received_data": body}
        )
    else:
        return _create_response(405, {"error": "Method not allowed"})


def _handle_api(
    http_method: str,
    path: str,
    path_parameters: Dict[str, Any],
    query_parameters: Dict[str, Any],
    body: Dict[str, Any],
) -> Dict[str, Any]:
    """Handle requests to /api endpoints"""

    # Parse path to determine endpoint
    path_parts = path.split("/")

    if len(path_parts) >= 3 and path_parts[2] == "v1":
        return _handle_v1_api(
            http_method, path_parts, path_parameters, query_parameters, body
        )
    else:
        return _create_response(
            200, {"message": "API endpoint", "path": path, "method": http_method}
        )


def _handle_v1_api(
    http_method: str,
    path_parts: list,
    path_parameters: Dict[str, Any],
    query_parameters: Dict[str, Any],
    body: Dict[str, Any],
) -> Dict[str, Any]:
    """Handle requests to /api/v1 endpoints"""

    if len(path_parts) >= 4:
        resource = path_parts[3]

        if resource == "users":
            return _handle_users(
                http_method, path_parts, path_parameters, query_parameters, body
            )
        elif resource == "transactions":
            return _handle_transactions(
                http_method, path_parts, path_parameters, query_parameters, body
            )
        else:
            return _create_response(404, {"error": f"Resource '{resource}' not found"})

    return _create_response(200, {"message": "API v1 endpoint", "method": http_method})


def _handle_users(
    http_method: str,
    path_parts: list,
    path_parameters: Dict[str, Any],
    query_parameters: Dict[str, Any],
    body: Dict[str, Any],
) -> Dict[str, Any]:
    """Handle user-related requests"""

    if len(path_parts) == 4:  # /api/v1/users
        if http_method == "GET":
            return _create_response(
                200, {"message": "Get all users", "query_parameters": query_parameters}
            )
        elif http_method == "POST":
            return _create_response(201, {"message": "Create user", "user_data": body})
        else:
            return _create_response(405, {"error": "Method not allowed"})

    elif len(path_parts) == 5:  # /api/v1/users/{user_id}
        user_id = path_parameters.get("user_id")

        if http_method == "GET":
            return _create_response(
                200, {"message": f"Get user {user_id}", "user_id": user_id}
            )
        elif http_method == "PUT":
            return _create_response(
                200,
                {
                    "message": f"Update user {user_id}",
                    "user_id": user_id,
                    "update_data": body,
                },
            )
        elif http_method == "DELETE":
            return _create_response(
                200, {"message": f"Delete user {user_id}", "user_id": user_id}
            )
        else:
            return _create_response(405, {"error": "Method not allowed"})

    return _create_response(404, {"error": "Invalid user endpoint"})


def _handle_transactions(
    http_method: str,
    path_parts: list,
    path_parameters: Dict[str, Any],
    query_parameters: Dict[str, Any],
    body: Dict[str, Any],
) -> Dict[str, Any]:
    """Handle transaction-related requests"""

    if len(path_parts) == 4:  # /api/v1/transactions
        if http_method == "GET":
            return _create_response(
                200,
                {
                    "message": "Get all transactions",
                    "query_parameters": query_parameters,
                },
            )
        elif http_method == "POST":
            return _create_response(
                201, {"message": "Create transaction", "transaction_data": body}
            )
        else:
            return _create_response(405, {"error": "Method not allowed"})

    elif len(path_parts) == 5:  # /api/v1/transactions/{transaction_id}
        transaction_id = path_parameters.get("transaction_id")

        if http_method == "GET":
            return _create_response(
                200,
                {
                    "message": f"Get transaction {transaction_id}",
                    "transaction_id": transaction_id,
                },
            )
        elif http_method == "PUT":
            return _create_response(
                200,
                {
                    "message": f"Update transaction {transaction_id}",
                    "transaction_id": transaction_id,
                    "update_data": body,
                },
            )
        elif http_method == "DELETE":
            return _create_response(
                200,
                {
                    "message": f"Delete transaction {transaction_id}",
                    "transaction_id": transaction_id,
                },
            )
        else:
            return _create_response(405, {"error": "Method not allowed"})

    return _create_response(404, {"error": "Invalid transaction endpoint"})


def _create_response(status_code: int, body: Dict[str, Any]) -> Dict[str, Any]:
    """Create a standardized API Gateway response"""

    return {
        "statusCode": status_code,
        "headers": {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token",
            "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS",
        },
        "body": json.dumps(body, default=str),
    }
