"""Tests for the Account PynamoDB model."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

# Import the Account class
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.account import Account


class TestAccount:
    """Test cases for Account model functionality."""

    def test_account_creation(self, sample_user_id, sample_account_data):
        """Test Account model creation with valid data."""
        with patch.object(Account, "save") as mock_save:
            account = Account.create(user_id=sample_user_id, **sample_account_data)

            assert account.user_id == sample_user_id
            assert account.name == sample_account_data["name"]
            assert account.institution == sample_account_data["institution"]
            assert account.account_type == sample_account_data["account_type"]
            assert account.amount == sample_account_data["amount"]
            assert account.value == sample_account_data["value"]
            assert account.balance == sample_account_data["balance"]
            assert account.interest_rate == sample_account_data["interest_rate"]
            assert account.active is True
            assert account._type == "account"
            mock_save.assert_called_once()

    def test_account_creation_with_minimal_data(self, sample_user_id):
        """Test Account model creation with minimal required data."""
        with patch.object(Account, "save") as mock_save:
            account = Account.create(
                user_id=sample_user_id, name="Minimal Account", account_type="checking"
            )

            assert account.user_id == sample_user_id
            assert account.name == "Minimal Account"
            assert account.account_type == "checking"
            assert account.active is True
            assert account._type == "account"
            mock_save.assert_called_once()

    def test_account_repr(self, sample_user_id, sample_account_data):
        """Test Account __repr__ method."""
        with patch.object(Account, "save"):
            account = Account.create(user_id=sample_user_id, **sample_account_data)

            repr_str = repr(account)
            assert sample_user_id in repr_str
            assert sample_account_data["name"] in repr_str

    def test_account_str(self, sample_user_id, sample_account_data):
        """Test Account __str__ method."""
        with patch.object(Account, "save"):
            account = Account.create(user_id=sample_user_id, **sample_account_data)

            str_repr = str(account)
            assert isinstance(str_repr, str)
            assert len(str_repr) > 0

    def test_account_as_dict(self, sample_user_id, sample_account_data):
        """Test Account as_dict method."""
        with patch.object(Account, "save"):
            account = Account.create(user_id=sample_user_id, **sample_account_data)

            account_dict = account.as_dict()

            assert isinstance(account_dict, dict)
            assert account_dict["user_id"] == sample_user_id
            assert account_dict["name"] == sample_account_data["name"]
            assert account_dict["account_type"] == sample_account_data["account_type"]
            assert account_dict["_type"] == "account"

    @patch("services.dynamo.account.Account.query")
    def test_name_exists_true(self, mock_query, sample_user_id):
        """Test name_exists method when name exists."""
        mock_account = MagicMock()
        mock_account.name = "Existing Account"
        mock_query.return_value = [mock_account]

        result = Account.name_exists(sample_user_id, "Existing Account")

        assert result is True
        mock_query.assert_called_once_with(sample_user_id)

    @patch("services.dynamo.account.Account.query")
    def test_name_exists_false(self, mock_query, sample_user_id):
        """Test name_exists method when name does not exist."""
        mock_query.return_value = []

        result = Account.name_exists(sample_user_id, "Non-existing Account")

        assert result is False
        mock_query.assert_called_once_with(sample_user_id)

    @patch("services.dynamo.account.Account.query")
    def test_name_exists_case_sensitive(self, mock_query, sample_user_id):
        """Test name_exists method is case sensitive."""
        mock_account = MagicMock()
        mock_account.name = "Existing Account"
        mock_query.return_value = [mock_account]

        result = Account.name_exists(sample_user_id, "existing account")

        assert result is False
        mock_query.assert_called_once_with(sample_user_id)

    @patch("services.dynamo.account.Account.get")
    def test_get_by_id_success(self, mock_get, sample_user_id, sample_account_id):
        """Test get_by_id method when account exists."""
        mock_account = MagicMock()
        mock_get.return_value = mock_account

        result = Account.get_by_id(sample_user_id, sample_account_id)

        mock_get.assert_called_once_with(sample_user_id, sample_account_id)
        assert result == mock_account

    @patch("services.dynamo.account.Account.get")
    def test_get_by_id_not_found(self, mock_get, sample_user_id, sample_account_id):
        """Test get_by_id method when account does not exist."""
        mock_get.side_effect = Account.DoesNotExist()

        result = Account.get_by_id(sample_user_id, sample_account_id)

        assert result is None

    @patch("services.dynamo.account.Account.query")
    def test_list_by_user(self, mock_query, sample_user_id):
        """Test list_by_user method."""
        mock_accounts = [MagicMock(), MagicMock()]
        mock_query.return_value = mock_accounts

        result = Account.list_by_user(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id)
        assert result == mock_accounts

    @patch("services.dynamo.account.Account.query")
    def test_list_active_by_user(self, mock_query, sample_user_id):
        """Test list_active_by_user method."""
        mock_accounts = [MagicMock(), MagicMock()]
        mock_query.return_value = mock_accounts

        result = Account.list_active_by_user(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id, Account.active == True)
        assert result == mock_accounts

    @patch("services.dynamo.account.Account.query")
    def test_list_by_type(self, mock_query, sample_user_id):
        """Test list_by_type method."""
        mock_accounts = [MagicMock()]
        mock_query.return_value = mock_accounts

        result = Account.list_by_type(sample_user_id, "checking")

        mock_query.assert_called_once_with(
            sample_user_id, Account.account_type == "checking"
        )
        assert result == mock_accounts

    def test_update_account(
        self, sample_user_id, sample_account_id, sample_account_data
    ):
        """Test update_account method."""
        with patch.object(Account, "save") as mock_save:
            # Create account first
            account = Account.create(user_id=sample_user_id, **sample_account_data)

            # Update account
            update_data = {"name": "Updated Account", "amount": 2000.0}
            updated_account = account.update_account(**update_data)

            assert updated_account.name == "Updated Account"
            assert updated_account.amount == 2000.0
            mock_save.assert_called()

    def test_deactivate_account(self, sample_user_id, sample_account_data):
        """Test deactivate_account method."""
        with patch.object(Account, "save") as mock_save:
            account = Account.create(user_id=sample_user_id, **sample_account_data)

            account.deactivate_account()

            assert account.active is False
            mock_save.assert_called()

    def test_account_meta_configuration(self):
        """Test Account Meta class configuration."""
        assert Account.Meta.region is not None
        assert Account.Meta.table_name is not None
        assert "account" in Account.Meta.table_name.lower()

    def test_account_attributes(self):
        """Test Account model attributes are properly defined."""
        # Test that all expected attributes exist
        assert hasattr(Account, "user_id")
        assert hasattr(Account, "account_id")
        assert hasattr(Account, "_type")
        assert hasattr(Account, "name")
        assert hasattr(Account, "active")
        assert hasattr(Account, "institution")
        assert hasattr(Account, "amount")
        assert hasattr(Account, "value")
        assert hasattr(Account, "balance")
        assert hasattr(Account, "account_type")
        assert hasattr(Account, "asset_type")
        assert hasattr(Account, "liability_type")
        assert hasattr(Account, "subtype")
        assert hasattr(Account, "url")
        assert hasattr(Account, "interest_rate")
        assert hasattr(Account, "icon_url")
        assert hasattr(Account, "last_update")

    def test_account_default_values(self, sample_user_id):
        """Test Account model default values."""
        with patch.object(Account, "save"):
            account = Account.create(
                user_id=sample_user_id, name="Test Account", account_type="checking"
            )

            assert account.active is True
            assert account._type == "account"
            assert account.last_update is not None
            assert isinstance(account.last_update, datetime)
