"""Tests for the Purchase PynamoDB model."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

# Import the Purchase class
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.purchase import Purchase


class TestPurchase:
    """Test cases for Purchase model functionality."""

    def test_purchase_creation(self, sample_user_id, sample_purchase_data):
        """Test Purchase model creation with valid data."""
        with patch.object(Purchase, "save") as mock_save:
            purchase = Purchase.create(user_id=sample_user_id, **sample_purchase_data)

            assert purchase.user_id == sample_user_id
            assert purchase.date == sample_purchase_data["date"]
            assert purchase.security_id == sample_purchase_data["security_id"]
            assert purchase.shares == sample_purchase_data["shares"]
            assert purchase.price == sample_purchase_data["price"]
            assert purchase.payment_from_id == sample_purchase_data["payment_from_id"]
            assert purchase.description == sample_purchase_data["description"]
            assert purchase._type == "purchase"
            mock_save.assert_called_once()

    def test_purchase_creation_with_minimal_data(self, sample_user_id):
        """Test Purchase model creation with minimal required data."""
        with patch.object(Purchase, "save") as mock_save:
            purchase = Purchase.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                security_id="security:test-123",
                account_id="account:test-123",
                amount=1000.0,
                merchant="Test Broker",
            )

            assert purchase.user_id == sample_user_id
            assert purchase.security_id == "security:test-123"
            assert purchase.account_id == "account:test-123"
            assert purchase.amount == 1000.0
            assert purchase.merchant == "Test Broker"
            assert purchase._type == "purchase"
            mock_save.assert_called_once()

    def test_purchase_creation_generates_uuid(self, sample_user_id):
        """Test that Purchase.create generates a unique purchase_id."""
        with patch.object(Purchase, "save"):
            purchase1 = Purchase.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                security_id="security:test-123",
                account_id="account:test-123",
                amount=1000.0,
                merchant="Test Broker",
            )
            purchase2 = Purchase.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                security_id="security:test-456",
                account_id="account:test-123",
                amount=2000.0,
                merchant="Test Broker",
            )

            assert purchase1.purchase_id != purchase2.purchase_id
            assert purchase1.purchase_id.startswith("purchase:")
            assert purchase2.purchase_id.startswith("purchase:")

    def test_purchase_repr(self, sample_user_id, sample_purchase_data):
        """Test Purchase __repr__ method."""
        with patch.object(Purchase, "save"):
            purchase = Purchase.create(user_id=sample_user_id, **sample_purchase_data)

            repr_str = repr(purchase)
            assert sample_user_id in repr_str
            assert sample_purchase_data["security_id"] in repr_str
            assert str(sample_purchase_data["amount"]) in repr_str

    def test_purchase_as_dict(self, sample_user_id, sample_purchase_data):
        """Test Purchase as_dict method."""
        with patch.object(Purchase, "save"):
            purchase = Purchase.create(user_id=sample_user_id, **sample_purchase_data)

            purchase_dict = purchase.as_dict()

            assert isinstance(purchase_dict, dict)
            assert purchase_dict["user_id"] == sample_user_id
            assert purchase_dict["security_id"] == sample_purchase_data["security_id"]
            assert purchase_dict["shares"] == sample_purchase_data["shares"]
            assert purchase_dict["price"] == sample_purchase_data["price"]
            assert purchase_dict["_type"] == "purchase"

    @patch("services.dynamo.purchase.Purchase.query")
    def test_list_by_user(self, mock_query, sample_user_id):
        """Test list_by_user method."""
        mock_purchases = [MagicMock(), MagicMock()]
        mock_query.return_value = mock_purchases

        result = Purchase.list_by_user(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id)
        assert result == mock_purchases

    @patch("services.dynamo.purchase.Purchase.query")
    def test_list_by_security(self, mock_query, sample_user_id):
        """Test list_by_security method."""
        mock_purchases = [MagicMock()]
        mock_query.return_value = mock_purchases

        result = Purchase.list_by_security(sample_user_id, "security:test-123")

        mock_query.assert_called_once_with(
            sample_user_id, Purchase.security_id == "security:test-123"
        )
        assert result == mock_purchases

    @patch("services.dynamo.purchase.Purchase.query")
    def test_list_by_account(self, mock_query, sample_user_id):
        """Test list_by_account method."""
        mock_purchases = [MagicMock()]
        mock_query.return_value = mock_purchases

        result = Purchase.list_by_account(sample_user_id, "account:test-123")

        mock_query.assert_called_once_with(
            sample_user_id, Purchase.account_id == "account:test-123"
        )
        assert result == mock_purchases

    @patch("services.dynamo.purchase.Purchase.query")
    def test_list_by_merchant(self, mock_query, sample_user_id):
        """Test list_by_merchant method."""
        mock_purchases = [MagicMock()]
        mock_query.return_value = mock_purchases

        result = Purchase.list_by_merchant(sample_user_id, "Test Broker")

        mock_query.assert_called_once_with(
            sample_user_id, Purchase.merchant == "Test Broker"
        )
        assert result == mock_purchases

    @patch("services.dynamo.purchase.Purchase.query")
    def test_list_by_date_range(self, mock_query, sample_user_id):
        """Test list_by_date_range method."""
        start_date = datetime(2023, 1, 1, tzinfo=timezone.utc)
        end_date = datetime(2023, 1, 31, tzinfo=timezone.utc)

        mock_purchases = [MagicMock()]
        mock_query.return_value = mock_purchases

        result = Purchase.list_by_date_range(sample_user_id, start_date, end_date)

        mock_query.assert_called_once_with(
            sample_user_id, Purchase.date.between(start_date, end_date)
        )
        assert result == mock_purchases

    def test_purchase_meta_configuration(self):
        """Test Purchase Meta class configuration."""
        assert Purchase.Meta.region is not None
        assert Purchase.Meta.table_name is not None
        assert "purchase" in Purchase.Meta.table_name.lower()

    def test_purchase_attributes(self):
        """Test Purchase model attributes are properly defined."""
        # Test that all expected attributes exist
        assert hasattr(Purchase, "user_id")
        assert hasattr(Purchase, "purchase_id")
        assert hasattr(Purchase, "_type")
        assert hasattr(Purchase, "date")
        assert hasattr(Purchase, "security_id")
        assert hasattr(Purchase, "account_id")
        assert hasattr(Purchase, "amount")
        assert hasattr(Purchase, "merchant")
        assert hasattr(Purchase, "shares")
        assert hasattr(Purchase, "price")
        assert hasattr(Purchase, "payment_from_id")

    def test_purchase_default_values(self, sample_user_id):
        """Test Purchase model default values."""
        with patch.object(Purchase, "save"):
            purchase = Purchase.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                security_id="security:test-123",
                account_id="account:test-123",
                amount=1000.0,
                merchant="Test Broker",
            )

            assert purchase._type == "purchase"

    def test_purchase_nullable_fields(self, sample_user_id):
        """Test Purchase model nullable fields."""
        with patch.object(Purchase, "save"):
            purchase = Purchase.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                security_id="security:test-123",
                account_id="account:test-123",
                amount=1000.0,
                merchant="Test Broker",
                shares=None,
                price=None,
                payment_from_id=None,
            )

            assert purchase.shares is None
            assert purchase.price is None
            assert purchase.payment_from_id is None

    def test_purchase_amount_validation(self, sample_user_id):
        """Test Purchase amount field validation."""
        with patch.object(Purchase, "save"):
            # Test with positive amount
            purchase = Purchase.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                security_id="security:test-123",
                account_id="account:test-123",
                amount=1000.0,
                merchant="Test Broker",
            )

            assert purchase.amount == 1000.0

            # Test with decimal amount
            purchase2 = Purchase.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                security_id="security:test-123",
                account_id="account:test-123",
                amount=999.99,
                merchant="Test Broker",
            )

            assert purchase2.amount == 999.99

    def test_purchase_date_handling(self, sample_user_id):
        """Test Purchase date field handling."""
        with patch.object(Purchase, "save"):
            test_date = datetime(2023, 6, 15, 14, 30, 0, tzinfo=timezone.utc)

            purchase = Purchase.create(
                user_id=sample_user_id,
                _date=test_date,
                security_id="security:test-123",
                account_id="account:test-123",
                amount=1000.0,
                merchant="Test Broker",
            )

            assert purchase.date == test_date
            assert purchase.date.tzinfo is not None

    def test_purchase_shares_and_price_handling(self, sample_user_id):
        """Test Purchase shares and price field handling."""
        with patch.object(Purchase, "save"):
            purchase = Purchase.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                security_id="security:test-123",
                account_id="account:test-123",
                amount=1000.0,
                merchant="Test Broker",
                shares=10.5,
                price=95.24,
            )

            assert purchase.shares == 10.5
            assert purchase.price == 95.24
