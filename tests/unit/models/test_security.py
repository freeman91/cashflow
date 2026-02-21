"""Tests for the Security PynamoDB model."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

# Import the Security class
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.security import Security


class TestSecurity:
    """Test cases for Security model functionality."""

    def test_security_creation(self, sample_user_id, sample_security_data):
        """Test Security model creation with valid data."""
        with patch.object(Security, "save") as mock_save:
            security = Security.create(user_id=sample_user_id, **sample_security_data)

            assert security.user_id == sample_user_id
            assert security.account_id == sample_security_data["account_id"]
            assert security.name == sample_security_data["name"]
            assert security.ticker == sample_security_data["ticker"]
            assert security.security_type == sample_security_data["security_type"]
            assert security.shares == sample_security_data["shares"]
            assert security.price == sample_security_data["price"]
            assert security.icon_url == sample_security_data["icon_url"]
            assert security.active is True
            assert security._type == "security"
            mock_save.assert_called_once()

    def test_security_creation_with_minimal_data(self, sample_user_id):
        """Test Security model creation with minimal required data."""
        with patch.object(Security, "save") as mock_save:
            security = Security.create(
                user_id=sample_user_id,
                account_id="account:test-123",
                name="Test Stock",
                security_type="stock",
                shares=10.0,
                price=100.0,
            )

            assert security.user_id == sample_user_id
            assert security.account_id == "account:test-123"
            assert security.name == "Test Stock"
            assert security.security_type == "stock"
            assert security.shares == 10.0
            assert security.price == 100.0
            assert security.active is True
            assert security._type == "security"
            mock_save.assert_called_once()

    def test_security_creation_generates_uuid(self, sample_user_id):
        """Test that Security.create generates a unique security_id."""
        with patch.object(Security, "save"):
            security1 = Security.create(
                user_id=sample_user_id,
                account_id="account:test-123",
                name="Stock 1",
                security_type="stock",
                shares=10.0,
                price=100.0,
            )
            security2 = Security.create(
                user_id=sample_user_id,
                account_id="account:test-123",
                name="Stock 2",
                security_type="stock",
                shares=5.0,
                price=200.0,
            )

            assert security1.security_id != security2.security_id
            assert security1.security_id.startswith("security:")
            assert security2.security_id.startswith("security:")

    def test_security_repr(self, sample_user_id, sample_security_data):
        """Test Security __repr__ method."""
        with patch.object(Security, "save"):
            security = Security.create(user_id=sample_user_id, **sample_security_data)

            repr_str = repr(security)
            assert sample_user_id in repr_str
            assert sample_security_data["name"] in repr_str
            assert str(sample_security_data["shares"]) in repr_str

    def test_security_as_dict(self, sample_user_id, sample_security_data):
        """Test Security as_dict method."""
        with patch.object(Security, "save"):
            security = Security.create(user_id=sample_user_id, **sample_security_data)

            security_dict = security.as_dict()

            assert isinstance(security_dict, dict)
            assert security_dict["user_id"] == sample_user_id
            assert security_dict["name"] == sample_security_data["name"]
            assert security_dict["ticker"] == sample_security_data["ticker"]
            assert (
                security_dict["security_type"] == sample_security_data["security_type"]
            )
            assert security_dict["shares"] == sample_security_data["shares"]
            assert security_dict["price"] == sample_security_data["price"]
            assert security_dict["_type"] == "security"

    @patch("services.dynamo.security.Security.query")
    def test_list_by_user(self, mock_query, sample_user_id):
        """Test list_by_user method."""
        mock_securities = [MagicMock(), MagicMock()]
        mock_query.return_value = mock_securities

        result = Security.list_by_user(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id)
        assert result == mock_securities

    @patch("services.dynamo.security.Security.query")
    def test_list_by_account(self, mock_query, sample_user_id):
        """Test list_by_account method."""
        mock_securities = [MagicMock()]
        mock_query.return_value = mock_securities

        result = Security.list_by_account(sample_user_id, "account:test-123")

        mock_query.assert_called_once_with(
            sample_user_id, Security.account_id == "account:test-123"
        )
        assert result == mock_securities

    @patch("services.dynamo.security.Security.query")
    def test_list_by_type(self, mock_query, sample_user_id):
        """Test list_by_type method."""
        mock_securities = [MagicMock()]
        mock_query.return_value = mock_securities

        result = Security.list_by_type(sample_user_id, "stock")

        mock_query.assert_called_once_with(
            sample_user_id, Security.security_type == "stock"
        )
        assert result == mock_securities

    @patch("services.dynamo.security.Security.query")
    def test_list_active(self, mock_query, sample_user_id):
        """Test list_active method."""
        mock_securities = [MagicMock()]
        mock_query.return_value = mock_securities

        result = Security.list_active(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id, Security.active == True)
        assert result == mock_securities

    @patch("services.dynamo.security.Security.get")
    def test_get_by_id_success(self, mock_get, sample_user_id, sample_security_id):
        """Test get_by_id method when security exists."""
        mock_security = MagicMock()
        mock_get.return_value = mock_security

        result = Security.get_by_id(sample_user_id, sample_security_id)

        mock_get.assert_called_once_with(sample_user_id, sample_security_id)
        assert result == mock_security

    @patch("services.dynamo.security.Security.get")
    def test_get_by_id_not_found(self, mock_get, sample_user_id, sample_security_id):
        """Test get_by_id method when security does not exist."""
        mock_get.side_effect = Security.DoesNotExist()

        result = Security.get_by_id(sample_user_id, sample_security_id)

        assert result is None

    def test_update_security(self, sample_user_id, sample_security_data):
        """Test update_ method."""
        with patch.object(Security, "save") as mock_save:
            # Create security first
            security = Security.create(user_id=sample_user_id, **sample_security_data)

            # Update security
            update_data = {"shares": 15.0, "price": 160.0}
            updated_security = security.update_(**update_data)

            assert updated_security.shares == 15.0
            assert updated_security.price == 160.0
            mock_save.assert_called()

    def test_deactivate_security(self, sample_user_id, sample_security_data):
        """Test deactivate_security method."""
        with patch.object(Security, "save") as mock_save:
            security = Security.create(user_id=sample_user_id, **sample_security_data)

            security.deactivate_security()

            assert security.active is False
            mock_save.assert_called()

    def test_security_meta_configuration(self):
        """Test Security Meta class configuration."""
        assert Security.Meta.region is not None
        assert Security.Meta.table_name is not None
        assert "security" in Security.Meta.table_name.lower()

    def test_security_attributes(self):
        """Test Security model attributes are properly defined."""
        # Test that all expected attributes exist
        assert hasattr(Security, "user_id")
        assert hasattr(Security, "security_id")
        assert hasattr(Security, "_type")
        assert hasattr(Security, "name")
        assert hasattr(Security, "active")
        assert hasattr(Security, "ticker")
        assert hasattr(Security, "account_id")
        assert hasattr(Security, "security_type")
        assert hasattr(Security, "shares")
        assert hasattr(Security, "price")
        assert hasattr(Security, "icon_url")
        assert hasattr(Security, "last_update")

    def test_security_default_values(self, sample_user_id):
        """Test Security model default values."""
        with patch.object(Security, "save"):
            security = Security.create(
                user_id=sample_user_id,
                account_id="account:test-123",
                name="Test Stock",
                security_type="stock",
                shares=10.0,
                price=100.0,
            )

            assert security.active is True
            assert security._type == "security"
            assert security.last_update is not None
            assert isinstance(security.last_update, datetime)

    def test_security_nullable_fields(self, sample_user_id):
        """Test Security model nullable fields."""
        with patch.object(Security, "save"):
            security = Security.create(
                user_id=sample_user_id,
                account_id="account:test-123",
                name="Test Stock",
                security_type="stock",
                shares=10.0,
                price=100.0,
                ticker=None,
                icon_url=None,
            )

            assert security.ticker is None
            assert security.icon_url is None

    def test_security_shares_and_price_validation(self, sample_user_id):
        """Test Security shares and price field validation."""
        with patch.object(Security, "save"):
            # Test with positive values
            security = Security.create(
                user_id=sample_user_id,
                account_id="account:test-123",
                name="Test Stock",
                security_type="stock",
                shares=10.5,
                price=99.99,
            )

            assert security.shares == 10.5
            assert security.price == 99.99

            # Test with zero values
            security2 = Security.create(
                user_id=sample_user_id,
                account_id="account:test-123",
                name="Test Stock 2",
                security_type="stock",
                shares=0.0,
                price=0.0,
            )

            assert security2.shares == 0.0
            assert security2.price == 0.0

    def test_security_types(self, sample_user_id):
        """Test different security types."""
        security_types = ["stock", "bond", "etf", "mutual_fund", "crypto"]

        with patch.object(Security, "save"):
            for sec_type in security_types:
                security = Security.create(
                    user_id=sample_user_id,
                    account_id="account:test-123",
                    name=f"Test {sec_type.title()}",
                    security_type=sec_type,
                    shares=1.0,
                    price=100.0,
                )

                assert security.security_type == sec_type
