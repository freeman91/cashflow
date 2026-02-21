"""Tests for the Expenses API controller."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone
import json

# Import the expenses controller
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.api.controllers.expenses import expenses


class TestExpensesController:
    """Test cases for Expenses controller functionality."""

    @patch("services.api.controllers.expenses.Expense.create")
    @patch("services.api.controllers.expenses.log_action")
    def test_create_expense_success(
        self, mock_log_action, mock_create, sample_user_id, sample_expense_data
    ):
        """Test successful expense creation."""
        mock_expense = MagicMock()
        mock_expense.as_dict.return_value = sample_expense_data
        mock_create.return_value = mock_expense

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.post(
                f"/expenses/{sample_user_id}",
                json=sample_expense_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_expense_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.expenses.Expense.list_by_user")
    def test_get_expenses_success(
        self, mock_list_by_user, sample_user_id, sample_expense_data
    ):
        """Test successful retrieval of expenses."""
        mock_expenses = [MagicMock(), MagicMock()]
        mock_expenses[0].as_dict.return_value = sample_expense_data
        mock_expenses[1].as_dict.return_value = sample_expense_data.copy()
        mock_list_by_user.return_value = mock_expenses

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.get(f"/expenses/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 2
            assert response_data["result"][0] == sample_expense_data

            mock_list_by_user.assert_called_once_with(sample_user_id)

    @patch("services.api.controllers.expenses.Expense.get_by_id")
    def test_get_expense_by_id_success(
        self, mock_get_by_id, sample_user_id, sample_expense_id, sample_expense_data
    ):
        """Test successful retrieval of expense by ID."""
        mock_expense = MagicMock()
        mock_expense.as_dict.return_value = sample_expense_data
        mock_get_by_id.return_value = mock_expense

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.get(f"/expenses/{sample_user_id}/{sample_expense_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_expense_data

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_expense_id)

    @patch("services.api.controllers.expenses.Expense.get_by_id")
    def test_get_expense_by_id_not_found(
        self, mock_get_by_id, sample_user_id, sample_expense_id
    ):
        """Test retrieval of non-existent expense by ID."""
        mock_get_by_id.return_value = None

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.get(f"/expenses/{sample_user_id}/{sample_expense_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Expense not found"

    @patch("services.api.controllers.expenses.Expense.get_by_id")
    @patch("services.api.controllers.expenses.log_action")
    def test_update_expense_success(
        self,
        mock_log_action,
        mock_get_by_id,
        sample_user_id,
        sample_expense_id,
        sample_expense_data,
    ):
        """Test successful expense update."""
        mock_expense = MagicMock()
        mock_expense.as_dict.return_value = sample_expense_data
        mock_get_by_id.return_value = mock_expense

        update_data = {"amount": 75.0, "merchant": "Updated Store"}

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.put(
                f"/expenses/{sample_user_id}/{sample_expense_id}",
                json=update_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_expense_data

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_expense_id)
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.expenses.Expense.get_by_id")
    def test_update_expense_not_found(
        self, mock_get_by_id, sample_user_id, sample_expense_id
    ):
        """Test update of non-existent expense."""
        mock_get_by_id.return_value = None

        update_data = {"amount": 75.0}

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.put(
                f"/expenses/{sample_user_id}/{sample_expense_id}",
                json=update_data,
                content_type="application/json",
            )

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Expense not found"

    @patch("services.api.controllers.expenses.Expense.get_by_id")
    @patch("services.api.controllers.expenses.log_action")
    def test_delete_expense_success(
        self,
        mock_log_action,
        mock_get_by_id,
        sample_user_id,
        sample_expense_id,
        sample_expense_data,
    ):
        """Test successful expense deletion."""
        mock_expense = MagicMock()
        mock_expense.as_dict.return_value = sample_expense_data
        mock_get_by_id.return_value = mock_expense

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.delete(f"/expenses/{sample_user_id}/{sample_expense_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == "Expense deleted successfully"

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_expense_id)
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.expenses.Expense.get_by_id")
    def test_delete_expense_not_found(
        self, mock_get_by_id, sample_user_id, sample_expense_id
    ):
        """Test deletion of non-existent expense."""
        mock_get_by_id.return_value = None

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.delete(f"/expenses/{sample_user_id}/{sample_expense_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Expense not found"

    def test_invalid_method(self, sample_user_id):
        """Test invalid HTTP method."""
        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.patch(f"/expenses/{sample_user_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Bad Request"

    def test_missing_json_data(self, sample_user_id):
        """Test POST request without JSON data."""
        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.post(f"/expenses/{sample_user_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Bad Request"

    @patch("services.api.controllers.expenses.Expense.create")
    def test_create_expense_with_recurring_id(self, mock_create, sample_user_id):
        """Test expense creation with recurring_id."""
        expense_data = {
            "date": datetime.now(timezone.utc).isoformat(),
            "amount": 50.0,
            "merchant": "Test Store",
            "category": "Food",
            "subcategory": "Groceries",
            "recurring_id": "recurring:test-123",
        }

        mock_expense = MagicMock()
        mock_expense.as_dict.return_value = expense_data
        mock_create.return_value = mock_expense

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.post(
                f"/expenses/{sample_user_id}",
                json=expense_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"]["recurring_id"] == "recurring:test-123"

    @patch("services.api.controllers.expenses.Expense.list_by_category")
    def test_get_expenses_by_category(
        self, mock_list_by_category, sample_user_id, sample_expense_data
    ):
        """Test retrieval of expenses by category."""
        mock_expenses = [MagicMock()]
        mock_expenses[0].as_dict.return_value = sample_expense_data
        mock_list_by_category.return_value = mock_expenses

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.get(f"/expenses/{sample_user_id}?category=Food")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1

            mock_list_by_category.assert_called_once_with(sample_user_id, "Food")

    @patch("services.api.controllers.expenses.Expense.list_pending")
    def test_get_pending_expenses(
        self, mock_list_pending, sample_user_id, sample_expense_data
    ):
        """Test retrieval of pending expenses."""
        mock_expenses = [MagicMock()]
        mock_expenses[0].as_dict.return_value = sample_expense_data
        mock_list_pending.return_value = mock_expenses

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(expenses)

        with app.test_client() as client:
            response = client.get(f"/expenses/{sample_user_id}?pending=true")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1

            mock_list_pending.assert_called_once_with(sample_user_id)
