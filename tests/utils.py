"""Test utilities for mocking DynamoDB operations and common test helpers."""

import os
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone
from typing import Any, Dict, List, Optional


class MockDynamoDBItem:
    """Mock DynamoDB item for testing."""

    def __init__(self, **kwargs):
        self.attribute_values = kwargs
        for key, value in kwargs.items():
            setattr(self, key, value)

    def as_dict(self):
        """Convert mock item to dictionary."""
        return self.attribute_values.copy()

    def save(self):
        """Mock save operation."""
        return True

    def delete(self):
        """Mock delete operation."""
        return True

    def update(self, **kwargs):
        """Mock update operation."""
        for key, value in kwargs.items():
            setattr(self, key, value)
            self.attribute_values[key] = value
        return True


class MockDynamoDBQuery:
    """Mock DynamoDB query result."""

    def __init__(self, items: List[MockDynamoDBItem]):
        self.items = items
        self._index = 0

    def __iter__(self):
        return self

    def __next__(self):
        if self._index < len(self.items):
            item = self.items[self._index]
            self._index += 1
            return item
        raise StopIteration

    def __len__(self):
        return len(self.items)


def mock_dynamodb_table(table_name: str, items: List[Dict[str, Any]] = None):
    """Create a mock DynamoDB table with optional items."""
    if items is None:
        items = []

    mock_items = [MockDynamoDBItem(**item) for item in items]

    class MockTable:
        def __init__(self):
            self.items = mock_items

        def get(self, hash_key: str, range_key: str = None):
            """Mock get operation."""
            for item in self.items:
                if hasattr(item, "user_id") and item.user_id == hash_key:
                    if range_key is None or (
                        hasattr(item, "account_id") and item.account_id == range_key
                    ):
                        return item
            raise Exception("Item not found")

        def query(self, hash_key: str, range_key_condition=None):
            """Mock query operation."""
            matching_items = []
            for item in self.items:
                if hasattr(item, "user_id") and item.user_id == hash_key:
                    matching_items.append(item)
            return MockDynamoDBQuery(matching_items)

        def scan(self):
            """Mock scan operation."""
            return MockDynamoDBQuery(self.items)

        def put_item(self, item):
            """Mock put_item operation."""
            self.items.append(MockDynamoDBItem(**item))
            return True

        def delete_item(self, hash_key: str, range_key: str = None):
            """Mock delete_item operation."""
            for i, item in enumerate(self.items):
                if hasattr(item, "user_id") and item.user_id == hash_key:
                    if range_key is None or (
                        hasattr(item, "account_id") and item.account_id == range_key
                    ):
                        del self.items[i]
                        return True
            return False

    return MockTable()


def setup_test_environment():
    """Set up test environment variables."""
    os.environ["ENV"] = "test"
    os.environ["REGION"] = "us-east-1"
    os.environ["APP_ID"] = "cashflow-test"


def create_mock_model_class(model_name: str, attributes: Dict[str, Any]):
    """Create a mock model class for testing."""

    class MockModel:
        DoesNotExist = Exception(f"{model_name} does not exist")

        def __init__(self, **kwargs):
            self.attribute_values = kwargs
            for key, value in kwargs.items():
                setattr(self, key, value)

        @classmethod
        def get(cls, hash_key: str, range_key: str = None):
            """Mock get method."""
            # This would be mocked in actual tests
            pass

        @classmethod
        def query(cls, hash_key: str, range_key_condition=None):
            """Mock query method."""
            # This would be mocked in actual tests
            pass

        @classmethod
        def scan(cls):
            """Mock scan method."""
            # This would be mocked in actual tests
            pass

        def save(self):
            """Mock save method."""
            return True

        def delete(self):
            """Mock delete method."""
            return True

        def as_dict(self):
            """Convert to dictionary."""
            return self.attribute_values.copy()

    return MockModel


def assert_dict_contains(expected: Dict[str, Any], actual: Dict[str, Any]):
    """Assert that actual dictionary contains all expected keys and values."""
    for key, expected_value in expected.items():
        assert key in actual, f"Key '{key}' not found in actual dictionary"
        assert (
            actual[key] == expected_value
        ), f"Value for key '{key}' does not match. Expected: {expected_value}, Actual: {actual[key]}"


def create_test_user_data(
    user_id: str = None, email: str = "test@example.com", name: str = "Test User"
):
    """Create test user data."""
    if user_id is None:
        user_id = f"user:test-{datetime.now().timestamp()}"

    return {
        "user_id": user_id,
        "email": email,
        "name": name,
        "_type": "user",
    }


def create_test_account_data(user_id: str, account_id: str = None, **kwargs):
    """Create test account data."""
    if account_id is None:
        account_id = f"account:test-{datetime.now().timestamp()}"

    default_data = {
        "user_id": user_id,
        "account_id": account_id,
        "name": "Test Account",
        "active": True,
        "institution": "Test Bank",
        "amount": 1000.0,
        "value": 1000.0,
        "balance": 1000.0,
        "account_type": "checking",
        "asset_type": "liquid",
        "liability_type": None,
        "subtype": "checking",
        "url": "https://testbank.com",
        "interest_rate": 0.01,
        "icon_url": "https://example.com/icon.png",
        "last_update": datetime.now(timezone.utc),
        "_type": "account",
    }

    default_data.update(kwargs)
    return default_data


def create_test_expense_data(user_id: str, expense_id: str = None, **kwargs):
    """Create test expense data."""
    if expense_id is None:
        expense_id = f"expense:test-{datetime.now().timestamp()}"

    default_data = {
        "user_id": user_id,
        "expense_id": expense_id,
        "date": datetime.now(timezone.utc),
        "pending": False,
        "recurring_id": None,
        "amount": 50.0,
        "merchant": "Test Store",
        "category": "Food",
        "subcategory": "Groceries",
        "payment_from_id": "account:test-123",
        "description": "Test expense",
        "_type": "expense",
    }

    default_data.update(kwargs)
    return default_data


def create_test_income_data(user_id: str, income_id: str = None, **kwargs):
    """Create test income data."""
    if income_id is None:
        income_id = f"income:test-{datetime.now().timestamp()}"

    default_data = {
        "user_id": user_id,
        "income_id": income_id,
        "date": datetime.now(timezone.utc),
        "amount": 3000.0,
        "source": "Test Company",
        "category": "Salary",
        "subcategory": "Regular",
        "deposit_to_id": "account:test-123",
        "description": "Test income",
        "_type": "income",
    }

    default_data.update(kwargs)
    return default_data


def create_test_security_data(user_id: str, security_id: str = None, **kwargs):
    """Create test security data."""
    if security_id is None:
        security_id = f"security:test-{datetime.now().timestamp()}"

    default_data = {
        "user_id": user_id,
        "security_id": security_id,
        "name": "Apple Inc.",
        "active": True,
        "ticker": "AAPL",
        "account_id": "account:test-123",
        "security_type": "stock",
        "shares": 10.0,
        "price": 150.0,
        "icon_url": "https://example.com/apple-icon.png",
        "last_update": datetime.now(timezone.utc),
        "_type": "security",
    }

    default_data.update(kwargs)
    return default_data
