"""Shared pytest configuration and fixtures for the cashflow project."""

import os
import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone
from uuid import uuid4

# Set test environment variables
os.environ["ENV"] = "test"
os.environ["REGION"] = "us-east-1"
os.environ["APP_ID"] = "cashflow-test"


@pytest.fixture
def mock_dynamodb():
    """Mock DynamoDB operations for testing."""
    with patch("pynamodb.models.Model") as mock_model:
        yield mock_model


@pytest.fixture
def sample_user_id():
    """Generate a sample user ID for testing."""
    return f"user:{uuid4()}"


@pytest.fixture
def sample_account_id():
    """Generate a sample account ID for testing."""
    return f"account:{uuid4()}"


@pytest.fixture
def sample_expense_id():
    """Generate a sample expense ID for testing."""
    return f"expense:{uuid4()}"


@pytest.fixture
def sample_income_id():
    """Generate a sample income ID for testing."""
    return f"income:{uuid4()}"


@pytest.fixture
def sample_security_id():
    """Generate a sample security ID for testing."""
    return f"security:{uuid4()}"


@pytest.fixture
def sample_purchase_id():
    """Generate a sample purchase ID for testing."""
    return f"purchase:{uuid4()}"


@pytest.fixture
def sample_sale_id():
    """Generate a sample sale ID for testing."""
    return f"sale:{uuid4()}"


@pytest.fixture
def sample_borrow_id():
    """Generate a sample borrow ID for testing."""
    return f"borrow:{uuid4()}"


@pytest.fixture
def sample_repayment_id():
    """Generate a sample repayment ID for testing."""
    return f"repayment:{uuid4()}"


@pytest.fixture
def sample_recurring_id():
    """Generate a sample recurring ID for testing."""
    return f"recurring:{uuid4()}"


@pytest.fixture
def sample_paycheck_id():
    """Generate a sample paycheck ID for testing."""
    return f"paycheck:{uuid4()}"


@pytest.fixture
def sample_budget_id():
    """Generate a sample budget ID for testing."""
    return f"budget:{uuid4()}"


@pytest.fixture
def sample_audit_id():
    """Generate a sample audit ID for testing."""
    return f"audit:{uuid4()}"


@pytest.fixture
def sample_timestamp():
    """Generate a sample timestamp for testing."""
    return datetime.now(timezone.utc)


@pytest.fixture
def sample_account_data():
    """Sample account data for testing."""
    return {
        "name": "Test Checking Account",
        "institution": "Test Bank",
        "url": "https://testbank.com",
        "account_type": "checking",
        "asset_type": "liquid",
        "liability_type": None,
        "subtype": "checking",
        "amount": 1000.0,
        "value": 1000.0,
        "balance": 1000.0,
        "interest_rate": 0.01,
        "icon_url": "https://example.com/icon.png",
    }


@pytest.fixture
def sample_expense_data():
    """Sample expense data for testing."""
    return {
        "date": datetime.now(timezone.utc),
        "amount": 50.0,
        "merchant": "Test Store",
        "category": "Food",
        "subcategory": "Groceries",
        "pending": False,
        "payment_from_id": "account:test-123",
        "description": "Test grocery purchase",
    }


@pytest.fixture
def sample_income_data():
    """Sample income data for testing."""
    return {
        "date": datetime.now(timezone.utc),
        "amount": 3000.0,
        "source": "Test Company",
        "category": "Salary",
        "subcategory": "Regular",
        "deposit_to_id": "account:test-123",
        "description": "Monthly salary",
    }


@pytest.fixture
def sample_security_data():
    """Sample security data for testing."""
    return {
        "account_id": "account:test-123",
        "name": "Apple Inc.",
        "ticker": "AAPL",
        "security_type": "stock",
        "shares": 10.0,
        "price": 150.0,
        "icon_url": "https://example.com/apple-icon.png",
    }


@pytest.fixture
def sample_purchase_data():
    """Sample purchase data for testing."""
    return {
        "date": datetime.now(timezone.utc),
        "security_id": "security:test-123",
        "shares": 5.0,
        "price": 150.0,
        "payment_from_id": "account:test-123",
        "description": "Stock purchase",
    }


@pytest.fixture
def sample_sale_data():
    """Sample sale data for testing."""
    return {
        "date": datetime.now(timezone.utc),
        "security_id": "security:test-123",
        "shares": 2.0,
        "price": 160.0,
        "deposit_to_id": "account:test-123",
        "description": "Stock sale",
    }


@pytest.fixture
def sample_borrow_data():
    """Sample borrow data for testing."""
    return {
        "date": datetime.now(timezone.utc),
        "amount": 5000.0,
        "lender": "Test Bank",
        "interest_rate": 0.05,
        "term_months": 60,
        "deposit_to_id": "account:test-123",
        "description": "Personal loan",
    }


@pytest.fixture
def sample_repayment_data():
    """Sample repayment data for testing."""
    return {
        "date": datetime.now(timezone.utc),
        "amount": 200.0,
        "borrow_id": "borrow:test-123",
        "payment_from_id": "account:test-123",
        "description": "Monthly loan payment",
    }


@pytest.fixture
def sample_recurring_data():
    """Sample recurring data for testing."""
    return {
        "name": "Monthly Salary",
        "frequency": "monthly",
        "amount": 3000.0,
        "category": "income",
        "subcategory": "salary",
        "start_date": datetime.now(timezone.utc),
        "end_date": None,
        "active": True,
    }


@pytest.fixture
def sample_paycheck_data():
    """Sample paycheck data for testing."""
    return {
        "date": datetime.now(timezone.utc),
        "amount": 3000.0,
        "employer": "Test Company",
        "deposit_to_id": "account:test-123",
        "description": "Bi-weekly paycheck",
    }


@pytest.fixture
def sample_budget_data():
    """Sample budget data for testing."""
    return {
        "name": "Monthly Budget",
        "amount": 2000.0,
        "category": "Food",
        "subcategory": "Groceries",
        "period": "monthly",
        "start_date": datetime.now(timezone.utc),
        "end_date": None,
        "active": True,
    }


@pytest.fixture
def sample_audit_data():
    """Sample audit data for testing."""
    return {
        "action": "create",
        "entity_type": "account",
        "entity_id": "account:test-123",
        "old_values": {},
        "new_values": {"name": "Test Account"},
        "timestamp": datetime.now(timezone.utc),
    }


@pytest.fixture
def mock_flask_app():
    """Mock Flask app for testing API controllers."""
    from flask import Flask

    app = Flask(__name__)
    app.config["TESTING"] = True

    with app.test_client() as client:
        yield client


@pytest.fixture
def mock_request_json():
    """Mock request.json for testing API controllers."""
    return {
        "name": "Test Item",
        "amount": 100.0,
        "description": "Test description",
    }


@pytest.fixture
def mock_success_response():
    """Mock success response structure."""
    return {"result": {"success": True}, "status_code": 200}


@pytest.fixture
def mock_failure_response():
    """Mock failure response structure."""
    return {"result": {"error": "Test error"}, "status_code": 400}
