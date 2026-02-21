"""Tests for the Users API controller."""

import pytest
from unittest.mock import patch, MagicMock
import json

# Import the users controller
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.api.controllers.users import users


class TestUsersController:
    """Test cases for Users controller functionality."""

    @patch("services.api.controllers.users.User.get_")
    def test_get_user_success(self, mock_get_user, sample_user_id):
        """Test successful user retrieval."""
        mock_user = MagicMock()
        user_data = {
            "user_id": sample_user_id,
            "email": "test@example.com",
            "name": "Test User",
            "_type": "user",
        }
        mock_user.as_dict.return_value = user_data
        mock_get_user.return_value = mock_user

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(users)

        with app.test_client() as client:
            response = client.get(f"/users/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)

            # Verify password is removed from response
            assert "password" not in response_data["result"]
            assert response_data["result"]["user_id"] == sample_user_id
            assert response_data["result"]["email"] == "test@example.com"
            assert response_data["result"]["name"] == "Test User"

            mock_get_user.assert_called_once_with(sample_user_id)

    @patch("services.api.controllers.users.User.get_")
    def test_get_user_not_found(self, mock_get_user, sample_user_id):
        """Test retrieval of non-existent user."""
        mock_get_user.side_effect = StopIteration()

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(users)

        with app.test_client() as client:
            response = client.get(f"/users/{sample_user_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Not Found"

    @patch("services.api.controllers.users.User.get_")
    def test_update_user_success(self, mock_get_user, sample_user_id):
        """Test successful user update."""
        mock_user = MagicMock()
        user_data = {
            "user_id": sample_user_id,
            "email": "test@example.com",
            "name": "Updated User",
            "_type": "user",
        }
        mock_user.as_dict.return_value = user_data
        mock_get_user.return_value = mock_user

        update_data = {"name": "Updated User"}

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(users)

        with app.test_client() as client:
            response = client.put(
                f"/users/{sample_user_id}",
                json=update_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)

            # Verify password is removed from response
            assert "password" not in response_data["result"]
            assert response_data["result"]["name"] == "Updated User"

            mock_get_user.assert_called_once_with(sample_user_id)

    @patch("services.api.controllers.users.User.get_")
    def test_update_user_not_found(self, mock_get_user, sample_user_id):
        """Test update of non-existent user."""
        mock_get_user.side_effect = StopIteration()

        update_data = {"name": "Updated User"}

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(users)

        with app.test_client() as client:
            response = client.put(
                f"/users/{sample_user_id}",
                json=update_data,
                content_type="application/json",
            )

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Not Found"

    def test_invalid_method(self, sample_user_id):
        """Test invalid HTTP method."""
        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(users)

        with app.test_client() as client:
            response = client.post(f"/users/{sample_user_id}")

            assert response.status_code == 400
            response_data = json.loads(response.data)
            assert response_data["result"] == "Not Found"

    def test_password_field_removal(self, sample_user_id):
        """Test that password field is always removed from responses."""
        mock_user = MagicMock()
        user_data = {
            "user_id": sample_user_id,
            "email": "test@example.com",
            "name": "Test User",
            "password": "hashed_password",
            "_type": "user",
        }
        mock_user.as_dict.return_value = user_data

        with patch("services.api.controllers.users.User.get_", return_value=mock_user):
            from flask import Flask

            app = Flask(__name__)
            app.register_blueprint(users)

            with app.test_client() as client:
                response = client.get(f"/users/{sample_user_id}")

                assert response.status_code == 200
                response_data = json.loads(response.data)

                # Verify password is removed from response
                assert "password" not in response_data["result"]
                assert response_data["result"]["user_id"] == sample_user_id
                assert response_data["result"]["email"] == "test@example.com"
                assert response_data["result"]["name"] == "Test User"

    def test_user_data_integrity(self, sample_user_id):
        """Test that user data integrity is maintained."""
        mock_user = MagicMock()
        user_data = {
            "user_id": sample_user_id,
            "email": "test@example.com",
            "name": "Test User",
            "_type": "user",
            "created_at": "2023-01-01T00:00:00Z",
        }
        mock_user.as_dict.return_value = user_data

        with patch("services.api.controllers.users.User.get_", return_value=mock_user):
            from flask import Flask

            app = Flask(__name__)
            app.register_blueprint(users)

            with app.test_client() as client:
                response = client.get(f"/users/{sample_user_id}")

                assert response.status_code == 200
                response_data = json.loads(response.data)

                # Verify all expected fields are present (except password)
                assert response_data["result"]["user_id"] == sample_user_id
                assert response_data["result"]["email"] == "test@example.com"
                assert response_data["result"]["name"] == "Test User"
                assert response_data["result"]["_type"] == "user"
                assert response_data["result"]["created_at"] == "2023-01-01T00:00:00Z"
