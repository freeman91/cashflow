"""Tests for the Securities API controller."""

import pytest
from unittest.mock import patch, MagicMock
import json

# Import the securities controller
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.api.controllers.securities import securities


class TestSecuritiesController:
    """Test cases for Securities controller functionality."""

    @patch("services.api.controllers.securities.Security.create")
    @patch("services.api.controllers.securities.log_action")
    def test_create_security_success(
        self, mock_log_action, mock_create, sample_user_id, sample_security_data
    ):
        """Test successful security creation."""
        mock_security = MagicMock()
        mock_security.as_dict.return_value = sample_security_data
        mock_create.return_value = mock_security

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.post(
                f"/securities/{sample_user_id}",
                json=sample_security_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_security_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.securities.Security.list_by_user")
    def test_get_securities_success(
        self, mock_list_by_user, sample_user_id, sample_security_data
    ):
        """Test successful retrieval of securities."""
        mock_securities = [MagicMock(), MagicMock()]
        mock_securities[0].as_dict.return_value = sample_security_data
        mock_securities[1].as_dict.return_value = sample_security_data.copy()
        mock_list_by_user.return_value = mock_securities

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.get(f"/securities/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 2
            assert response_data["result"][0] == sample_security_data

            mock_list_by_user.assert_called_once_with(sample_user_id)

    @patch("services.api.controllers.securities.Security.get_by_id")
    def test_get_security_by_id_success(
        self, mock_get_by_id, sample_user_id, sample_security_id, sample_security_data
    ):
        """Test successful retrieval of security by ID."""
        mock_security = MagicMock()
        mock_security.as_dict.return_value = sample_security_data
        mock_get_by_id.return_value = mock_security

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.get(f"/securities/{sample_user_id}/{sample_security_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_security_data

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_security_id)

    @patch("services.api.controllers.securities.Security.get_by_id")
    def test_get_security_by_id_not_found(
        self, mock_get_by_id, sample_user_id, sample_security_id
    ):
        """Test retrieval of non-existent security by ID."""
        mock_get_by_id.return_value = None

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.get(f"/securities/{sample_user_id}/{sample_security_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Security not found"

    @patch("services.api.controllers.securities.Security.get_by_id")
    @patch("services.api.controllers.securities.log_action")
    def test_update_security_success(
        self,
        mock_log_action,
        mock_get_by_id,
        sample_user_id,
        sample_security_id,
        sample_security_data,
    ):
        """Test successful security update."""
        mock_security = MagicMock()
        mock_security.as_dict.return_value = sample_security_data
        mock_get_by_id.return_value = mock_security

        update_data = {"shares": 15.0, "price": 160.0}

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.put(
                f"/securities/{sample_user_id}/{sample_security_id}",
                json=update_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_security_data

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_security_id)
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.securities.Security.get_by_id")
    def test_update_security_not_found(
        self, mock_get_by_id, sample_user_id, sample_security_id
    ):
        """Test update of non-existent security."""
        mock_get_by_id.return_value = None

        update_data = {"shares": 15.0}

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.put(
                f"/securities/{sample_user_id}/{sample_security_id}",
                json=update_data,
                content_type="application/json",
            )

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Security not found"

    @patch("services.api.controllers.securities.Security.get_by_id")
    @patch("services.api.controllers.securities.log_action")
    def test_delete_security_success(
        self,
        mock_log_action,
        mock_get_by_id,
        sample_user_id,
        sample_security_id,
        sample_security_data,
    ):
        """Test successful security deletion."""
        mock_security = MagicMock()
        mock_security.as_dict.return_value = sample_security_data
        mock_get_by_id.return_value = mock_security

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.delete(
                f"/securities/{sample_user_id}/{sample_security_id}"
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == "Security deleted successfully"

            mock_get_by_id.assert_called_once_with(sample_user_id, sample_security_id)
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.securities.Security.get_by_id")
    def test_delete_security_not_found(
        self, mock_get_by_id, sample_user_id, sample_security_id
    ):
        """Test deletion of non-existent security."""
        mock_get_by_id.return_value = None

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.delete(
                f"/securities/{sample_user_id}/{sample_security_id}"
            )

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Security not found"

    def test_invalid_method(self, sample_user_id):
        """Test invalid HTTP method."""
        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.patch(f"/securities/{sample_user_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Bad Request"

    def test_missing_json_data(self, sample_user_id):
        """Test POST request without JSON data."""
        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.post(f"/securities/{sample_user_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Bad Request"

    @patch("services.api.controllers.securities.Security.create")
    def test_create_security_with_minimal_data(self, mock_create, sample_user_id):
        """Test security creation with minimal required data."""
        security_data = {
            "account_id": "account:test-123",
            "name": "Test Stock",
            "security_type": "stock",
            "shares": 10.0,
            "price": 100.0,
        }

        mock_security = MagicMock()
        mock_security.as_dict.return_value = security_data
        mock_create.return_value = mock_security

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.post(
                f"/securities/{sample_user_id}",
                json=security_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"]["name"] == "Test Stock"
            assert response_data["result"]["security_type"] == "stock"
            assert response_data["result"]["shares"] == 10.0
            assert response_data["result"]["price"] == 100.0

    @patch("services.api.controllers.securities.Security.list_by_account")
    def test_get_securities_by_account(
        self, mock_list_by_account, sample_user_id, sample_security_data
    ):
        """Test retrieval of securities by account."""
        mock_securities = [MagicMock()]
        mock_securities[0].as_dict.return_value = sample_security_data
        mock_list_by_account.return_value = mock_securities

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.get(
                f"/securities/{sample_user_id}?account_id=account:test-123"
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1

            mock_list_by_account.assert_called_once_with(
                sample_user_id, "account:test-123"
            )

    @patch("services.api.controllers.securities.Security.list_by_type")
    def test_get_securities_by_type(
        self, mock_list_by_type, sample_user_id, sample_security_data
    ):
        """Test retrieval of securities by type."""
        mock_securities = [MagicMock()]
        mock_securities[0].as_dict.return_value = sample_security_data
        mock_list_by_type.return_value = mock_securities

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.get(f"/securities/{sample_user_id}?security_type=stock")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1

            mock_list_by_type.assert_called_once_with(sample_user_id, "stock")

    @patch("services.api.controllers.securities.Security.list_active")
    def test_get_active_securities(
        self, mock_list_active, sample_user_id, sample_security_data
    ):
        """Test retrieval of active securities."""
        mock_securities = [MagicMock()]
        mock_securities[0].as_dict.return_value = sample_security_data
        mock_list_active.return_value = mock_securities

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(securities)

        with app.test_client() as client:
            response = client.get(f"/securities/{sample_user_id}?active=true")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1

            mock_list_active.assert_called_once_with(sample_user_id)
