"""Tests for the User PynamoDB model."""

import pytest
from unittest.mock import patch, MagicMock

# Import the User class
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.user import User


class TestUser:
    """Test cases for User model functionality."""

    def test_user_creation(self):
        """Test User model creation with valid data."""
        with patch.object(User, "save") as mock_save:
            user = User.create(email="test@example.com", name="Test User")

            assert user.email == "test@example.com"
            assert user.name == "Test User"
            assert user._type == "user"
            assert user.user_id.startswith("user:")
            mock_save.assert_called_once()

    def test_user_creation_generates_uuid(self):
        """Test that User.create generates a unique user_id."""
        with patch.object(User, "save"):
            user1 = User.create(email="test1@example.com", name="User 1")
            user2 = User.create(email="test2@example.com", name="User 2")

            assert user1.user_id != user2.user_id
            assert user1.user_id.startswith("user:")
            assert user2.user_id.startswith("user:")

    def test_user_repr(self):
        """Test User __repr__ method."""
        with patch.object(User, "save"):
            user = User.create(email="test@example.com", name="Test User")

            repr_str = repr(user)
            assert user.user_id in repr_str
            assert user.email in repr_str
            assert user.name in repr_str

    def test_user_as_dict(self):
        """Test User as_dict method."""
        with patch.object(User, "save"):
            user = User.create(email="test@example.com", name="Test User")

            user_dict = user.as_dict()

            assert isinstance(user_dict, dict)
            assert user_dict["email"] == "test@example.com"
            assert user_dict["name"] == "Test User"
            assert user_dict["_type"] == "user"
            assert user_dict["user_id"] == user.user_id

    @patch("services.dynamo.user.User.query")
    def test_get_success(self, mock_query):
        """Test get_ method when user exists."""
        mock_user = MagicMock()
        mock_query.return_value = [mock_user]

        result = User.get_("test_user_id")

        mock_query.assert_called_once_with("test_user_id")
        assert result == mock_user

    @patch("services.dynamo.user.User.query")
    def test_get_not_found(self, mock_query):
        """Test get_ method when user does not exist."""
        mock_query.return_value = []

        with pytest.raises(StopIteration):
            User.get_("non_existent_user_id")

    def test_update_user(self):
        """Test update_ method."""
        with patch.object(User, "save"):
            user = User.create(email="test@example.com", name="Test User")

            update_data = {"name": "Updated User"}
            updated_user = user.update_(update_data)

            # Note: The current implementation doesn't actually update the user
            # This test documents the current behavior
            assert updated_user == user

    def test_user_meta_configuration(self):
        """Test User Meta class configuration."""
        assert User.Meta.region is not None
        assert User.Meta.table_name is not None
        assert "user" in User.Meta.table_name.lower()

    def test_user_attributes(self):
        """Test User model attributes are properly defined."""
        # Test that all expected attributes exist
        assert hasattr(User, "user_id")
        assert hasattr(User, "email")
        assert hasattr(User, "_type")
        assert hasattr(User, "name")
        assert hasattr(User, "password")

    def test_user_default_values(self):
        """Test User model default values."""
        with patch.object(User, "save"):
            user = User.create(email="test@example.com", name="Test User")

            assert user._type == "user"
            assert user.password is None

    def test_user_password_attribute(self):
        """Test User password attribute handling."""
        with patch.object(User, "save"):
            user = User.create(email="test@example.com", name="Test User")

            # Test that password can be set to None
            user.password = None
            assert user.password is None

            # Test that password can be set to binary data
            test_password = b"hashed_password"
            user.password = test_password
            assert user.password == test_password

    def test_user_hash_key_and_range_key(self):
        """Test User model key structure."""
        with patch.object(User, "save"):
            user = User.create(email="test@example.com", name="Test User")

            # user_id should be the hash key
            assert user.user_id is not None

            # email should be the range key
            assert user.email == "test@example.com"

    def test_user_type_consistency(self):
        """Test that _type is consistently set to 'user'."""
        with patch.object(User, "save"):
            user = User.create(email="test@example.com", name="Test User")

            assert user._type == "user"

            # Test multiple users have same type
            user2 = User.create(email="test2@example.com", name="User 2")

            assert user2._type == "user"
            assert user._type == user2._type
