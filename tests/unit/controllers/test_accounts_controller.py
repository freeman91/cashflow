"""Tests for the Accounts API controller."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone
import json

# Import the accounts controller
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.api.controllers.accounts import accounts


class TestAccountsController:
    """Test cases for Accounts controller functionality."""

    @patch("services.api.controllers.accounts.Account.create")
    @patch("services.api.controllers.accounts.Account.name_exists")
    @patch("services.api.controllers.accounts.log_action")
    def test_create_account_success(
        self,
        mock_log_action,
        mock_name_exists,
        mock_create,
        sample_user_id,
        sample_account_data,
    ):
        """Test successful account creation."""
        # Setup mocks
        mock_name_exists.return_value = False
        mock_account = MagicMock()
        mock_account.as_dict.return_value = sample_account_data
        mock_create.return_value = mock_account

        # Create test client
        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.post(
                f"/accounts/{sample_user_id}",
                json=sample_account_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_account_data

            mock_name_exists.assert_called_once_with(
                sample_user_id, sample_account_data["name"]
            )
            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.accounts.Account.name_exists")
    def test_create_account_name_exists(
        self, mock_name_exists, sample_user_id, sample_account_data
    ):
        """Test account creation when name already exists."""
        mock_name_exists.return_value = True

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.post(
                f"/accounts/{sample_user_id}",
                json=sample_account_data,
                content_type="application/json",
            )

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Name already exists"

    @patch("services.api.controllers.accounts.Account.create")
    @patch("services.api.controllers.accounts.Account.name_exists")
    def test_create_account_with_empty_strings(
        self, mock_name_exists, mock_create, sample_user_id
    ):
        """Test account creation with empty string values converted to None."""
        mock_name_exists.return_value = False
        mock_account = MagicMock()
        mock_account.as_dict.return_value = {}
        mock_create.return_value = mock_account

        account_data = {
            "name": "Test Account",
            "account_type": "checking",
            "amount": "",
            "value": "",
            "balance": "",
            "interest_rate": "",
        }

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.post(
                f"/accounts/{sample_user_id}",
                json=account_data,
                content_type="application/json",
            )

            assert response.status_code == 200

            # Verify that empty strings were converted to None
            call_args = mock_create.call_args[1]
            assert call_args["amount"] is None
            assert call_args["value"] is None
            assert call_args["balance"] is None
            assert call_args["interest_rate"] is None

    @patch("services.api.controllers.accounts.Account.list")
    def test_get_accounts_success(self, mock_list, sample_user_id, sample_account_data):
        """Test successful retrieval of accounts."""
        mock_accounts = [MagicMock(), MagicMock()]
        mock_accounts[0].as_dict.return_value = sample_account_data
        mock_accounts[1].as_dict.return_value = sample_account_data.copy()
        mock_list.return_value = mock_accounts

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.get(f"/accounts/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 2
            assert response_data["result"][0] == sample_account_data

            mock_list.assert_called_once_with(user_id=sample_user_id)

    @patch("services.api.controllers.accounts.Account.get_by_id")
    def test_get_account_by_id_success(
        self, mock_get_by_id, sample_user_id, sample_account_id, sample_account_data
    ):
        """Test successful retrieval of account by ID."""
        mock_account = MagicMock()
        mock_account.as_dict.return_value = sample_account_data
        mock_get_by_id.return_value = mock_account

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.get(f"/accounts/{sample_user_id}/{sample_account_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_account_data

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_account_id)

    @patch("services.api.controllers.accounts.Account.get_by_id")
    def test_get_account_by_id_not_found(
        self, mock_get_by_id, sample_user_id, sample_account_id
    ):
        """Test retrieval of non-existent account by ID."""
        mock_get_by_id.return_value = None

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.get(f"/accounts/{sample_user_id}/{sample_account_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Account not found"

    @patch("services.api.controllers.accounts.Account.get_by_id")
    @patch("services.api.controllers.accounts.log_action")
    def test_update_account_success(
        self,
        mock_log_action,
        mock_get_by_id,
        sample_user_id,
        sample_account_id,
        sample_account_data,
    ):
        """Test successful account update."""
        mock_account = MagicMock()
        mock_account.as_dict.return_value = sample_account_data
        mock_get_by_id.return_value = mock_account

        update_data = {"name": "Updated Account", "amount": 2000.0}

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.put(
                f"/accounts/{sample_user_id}/{sample_account_id}",
                json=update_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_account_data

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_account_id)
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.accounts.Account.get_by_id")
    def test_update_account_not_found(
        self, mock_get_by_id, sample_user_id, sample_account_id
    ):
        """Test update of non-existent account."""
        mock_get_by_id.return_value = None

        update_data = {"name": "Updated Account"}

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.put(
                f"/accounts/{sample_user_id}/{sample_account_id}",
                json=update_data,
                content_type="application/json",
            )

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Account not found"

    @patch("services.api.controllers.accounts.Account.get_by_id")
    @patch("services.api.controllers.accounts.log_action")
    def test_delete_account_success(
        self,
        mock_log_action,
        mock_get_by_id,
        sample_user_id,
        sample_account_id,
        sample_account_data,
    ):
        """Test successful account deletion."""
        mock_account = MagicMock()
        mock_account.as_dict.return_value = sample_account_data
        mock_get_by_id.return_value = mock_account

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.delete(f"/accounts/{sample_user_id}/{sample_account_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == "Account deleted successfully"

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_account_id)
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.accounts.Account.get_by_id")
    def test_delete_account_not_found(
        self, mock_get_by_id, sample_user_id, sample_account_id
    ):
        """Test deletion of non-existent account."""
        mock_get_by_id.return_value = None

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.delete(f"/accounts/{sample_user_id}/{sample_account_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Account not found"

    def test_invalid_method(self, sample_user_id):
        """Test invalid HTTP method."""
        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.patch(f"/accounts/{sample_user_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Bad Request"

    def test_missing_json_data(self, sample_user_id):
        """Test POST request without JSON data."""
        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(accounts)

        with app.test_client() as client:
            response = client.post(f"/accounts/{sample_user_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Bad Request"
