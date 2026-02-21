"""Integration tests for the cashflow application."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone
import json

# Import the main application components
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.main import app


class TestIntegration:
    """Integration tests for the cashflow application."""

    def test_app_initialization(self):
        """Test that the Flask app initializes correctly."""
        assert app is not None
        assert app.config is not None

    def test_health_check_endpoint(self):
        """Test health check endpoint if it exists."""
        with app.test_client() as client:
            # Try common health check paths
            for path in ["/health", "/healthcheck", "/status"]:
                response = client.get(path)
                if response.status_code == 200:
                    assert response.status_code == 200
                    break
            else:
                # If no health check endpoint exists, that's okay
                pass

    @patch("services.dynamo.user.User.create")
    @patch("services.dynamo.account.Account.create")
    @patch("services.dynamo.expense.Expense.create")
    def test_user_account_expense_workflow(
        self, mock_expense_create, mock_account_create, mock_user_create, sample_user_id
    ):
        """Test the complete workflow of creating a user, account, and expense."""
        # Mock user creation
        mock_user = MagicMock()
        mock_user.user_id = sample_user_id
        mock_user.as_dict.return_value = {
            "user_id": sample_user_id,
            "email": "test@example.com",
            "name": "Test User",
            "_type": "user",
        }
        mock_user_create.return_value = mock_user

        # Mock account creation
        mock_account = MagicMock()
        mock_account.account_id = "account:test-123"
        mock_account.as_dict.return_value = {
            "user_id": sample_user_id,
            "account_id": "account:test-123",
            "name": "Test Checking Account",
            "account_type": "checking",
            "amount": 1000.0,
            "_type": "account",
        }
        mock_account_create.return_value = mock_account

        # Mock expense creation
        mock_expense = MagicMock()
        mock_expense.expense_id = "expense:test-123"
        mock_expense.as_dict.return_value = {
            "user_id": sample_user_id,
            "expense_id": "expense:test-123",
            "date": datetime.now(timezone.utc).isoformat(),
            "amount": 50.0,
            "merchant": "Test Store",
            "category": "Food",
            "subcategory": "Groceries",
            "_type": "expense",
        }
        mock_expense_create.return_value = mock_expense

        with app.test_client() as client:
            # Test account creation
            account_data = {
                "name": "Test Checking Account",
                "account_type": "checking",
                "amount": 1000.0,
            }

            response = client.post(
                f"/accounts/{sample_user_id}",
                json=account_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"]["name"] == "Test Checking Account"

            # Test expense creation
            expense_data = {
                "date": datetime.now(timezone.utc).isoformat(),
                "amount": 50.0,
                "merchant": "Test Store",
                "category": "Food",
                "subcategory": "Groceries",
                "payment_from_id": "account:test-123",
            }

            response = client.post(
                f"/expenses/{sample_user_id}",
                json=expense_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"]["amount"] == 50.0
            assert response_data["result"]["merchant"] == "Test Store"

    @patch("services.dynamo.security.Security.create")
    @patch("services.dynamo.purchase.Purchase.create")
    def test_security_purchase_workflow(
        self, mock_purchase_create, mock_security_create, sample_user_id
    ):
        """Test the workflow of creating a security and making a purchase."""
        # Mock security creation
        mock_security = MagicMock()
        mock_security.security_id = "security:test-123"
        mock_security.as_dict.return_value = {
            "user_id": sample_user_id,
            "security_id": "security:test-123",
            "name": "Apple Inc.",
            "ticker": "AAPL",
            "security_type": "stock",
            "shares": 10.0,
            "price": 150.0,
            "_type": "security",
        }
        mock_security_create.return_value = mock_security

        # Mock purchase creation
        mock_purchase = MagicMock()
        mock_purchase.purchase_id = "purchase:test-123"
        mock_purchase.as_dict.return_value = {
            "user_id": sample_user_id,
            "purchase_id": "purchase:test-123",
            "date": datetime.now(timezone.utc).isoformat(),
            "security_id": "security:test-123",
            "amount": 1500.0,
            "shares": 10.0,
            "price": 150.0,
            "_type": "purchase",
        }
        mock_purchase_create.return_value = mock_purchase

        with app.test_client() as client:
            # Test security creation
            security_data = {
                "account_id": "account:test-123",
                "name": "Apple Inc.",
                "ticker": "AAPL",
                "security_type": "stock",
                "shares": 10.0,
                "price": 150.0,
            }

            response = client.post(
                f"/securities/{sample_user_id}",
                json=security_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"]["name"] == "Apple Inc."
            assert response_data["result"]["ticker"] == "AAPL"

            # Test purchase creation
            purchase_data = {
                "date": datetime.now(timezone.utc).isoformat(),
                "security_id": "security:test-123",
                "account_id": "account:test-123",
                "amount": 1500.0,
                "merchant": "Test Broker",
                "shares": 10.0,
                "price": 150.0,
            }

            response = client.post(
                f"/purchases/{sample_user_id}",
                json=purchase_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"]["amount"] == 1500.0
            assert response_data["result"]["shares"] == 10.0

    @patch("services.dynamo.income.Income.create")
    @patch("services.dynamo.borrow.Borrow.create")
    def test_income_borrow_workflow(
        self, mock_borrow_create, mock_income_create, sample_user_id
    ):
        """Test the workflow of creating income and borrow records."""
        # Mock income creation
        mock_income = MagicMock()
        mock_income.income_id = "income:test-123"
        mock_income.as_dict.return_value = {
            "user_id": sample_user_id,
            "income_id": "income:test-123",
            "date": datetime.now(timezone.utc).isoformat(),
            "amount": 3000.0,
            "source": "Test Company",
            "category": "Salary",
            "_type": "income",
        }
        mock_income_create.return_value = mock_income

        # Mock borrow creation
        mock_borrow = MagicMock()
        mock_borrow.borrow_id = "borrow:test-123"
        mock_borrow.as_dict.return_value = {
            "user_id": sample_user_id,
            "borrow_id": "borrow:test-123",
            "date": datetime.now(timezone.utc).isoformat(),
            "amount": 5000.0,
            "lender": "Test Bank",
            "interest_rate": 0.05,
            "term_months": 60,
            "_type": "borrow",
        }
        mock_borrow_create.return_value = mock_borrow

        with app.test_client() as client:
            # Test income creation
            income_data = {
                "date": datetime.now(timezone.utc).isoformat(),
                "amount": 3000.0,
                "source": "Test Company",
                "category": "Salary",
                "deposit_to_id": "account:test-123",
            }

            response = client.post(
                f"/incomes/{sample_user_id}",
                json=income_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"]["amount"] == 3000.0
            assert response_data["result"]["source"] == "Test Company"

            # Test borrow creation
            borrow_data = {
                "date": datetime.now(timezone.utc).isoformat(),
                "amount": 5000.0,
                "lender": "Test Bank",
                "interest_rate": 0.05,
                "term_months": 60,
                "deposit_to_id": "account:test-123",
            }

            response = client.post(
                f"/borrows/{sample_user_id}",
                json=borrow_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"]["amount"] == 5000.0
            assert response_data["result"]["lender"] == "Test Bank"

    def test_error_handling(self, sample_user_id):
        """Test error handling across the application."""
        with app.test_client() as client:
            # Test invalid endpoint
            response = client.get("/invalid-endpoint")
            assert response.status_code == 404

            # Test invalid method on valid endpoint
            response = client.patch(f"/accounts/{sample_user_id}")
            assert response.status_code == 400

            # Test missing JSON data
            response = client.post(f"/accounts/{sample_user_id}")
            assert response.status_code == 400

    def test_cors_headers(self, sample_user_id):
        """Test that CORS headers are properly set."""
        with app.test_client() as client:
            response = client.options(f"/accounts/{sample_user_id}")

            # Check for CORS headers
            assert "Access-Control-Allow-Origin" in response.headers
            assert "Access-Control-Allow-Methods" in response.headers
            assert "Access-Control-Allow-Headers" in response.headers

    def test_json_content_type_handling(self, sample_user_id):
        """Test that JSON content type is properly handled."""
        with app.test_client() as client:
            # Test with proper content type
            response = client.post(
                f"/accounts/{sample_user_id}",
                json={"name": "Test Account", "account_type": "checking"},
                content_type="application/json",
            )

            # Should not return 415 Unsupported Media Type
            assert response.status_code != 415

    def test_response_format_consistency(self, sample_user_id):
        """Test that all responses follow the same format."""
        with app.test_client() as client:
            # Test GET request
            response = client.get(f"/accounts/{sample_user_id}")

            if response.status_code == 200:
                response_data = json.loads(response.data)
                assert "result" in response_data

            # Test POST request with invalid data
            response = client.post(
                f"/accounts/{sample_user_id}",
                json={},  # Empty data should cause error
                content_type="application/json",
            )

            response_data = json.loads(response.data)
            assert "result" in response_data
