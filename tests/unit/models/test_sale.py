"""Tests for the Sale PynamoDB model."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

# Import the Sale class
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.sale import Sale


class TestSale:
    """Test cases for Sale model functionality."""

    def test_sale_creation(self, sample_user_id, sample_sale_data):
        """Test Sale model creation with valid data."""
        with patch.object(Sale, "save") as mock_save:
            sale = Sale.create(user_id=sample_user_id, **sample_sale_data)

            assert sale.user_id == sample_user_id
            assert sale.date == sample_sale_data["date"]
            assert sale.security_id == sample_sale_data["security_id"]
            assert sale.shares == sample_sale_data["shares"]
            assert sale.price == sample_sale_data["price"]
            assert sale.deposit_to_id == sample_sale_data["deposit_to_id"]
            assert sale.description == sample_sale_data["description"]
            assert sale._type == "sale"
            mock_save.assert_called_once()

    def test_sale_creation_with_minimal_data(self, sample_user_id):
        """Test Sale model creation with minimal required data."""
        with patch.object(Sale, "save") as mock_save:
            sale = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=2000.0,
                security_id="security:test-123",
                account_id="account:test-123",
            )

            assert sale.user_id == sample_user_id
            assert sale.security_id == "security:test-123"
            assert sale.account_id == "account:test-123"
            assert sale.amount == 2000.0
            assert sale._type == "sale"
            mock_save.assert_called_once()

    def test_sale_creation_generates_uuid(self, sample_user_id):
        """Test that Sale.create generates a unique sale_id."""
        with patch.object(Sale, "save"):
            sale1 = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=2000.0,
                security_id="security:test-123",
                account_id="account:test-123",
            )
            sale2 = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=3000.0,
                security_id="security:test-456",
                account_id="account:test-123",
            )

            assert sale1.sale_id != sale2.sale_id
            assert sale1.sale_id.startswith("sale:")
            assert sale2.sale_id.startswith("sale:")

    def test_sale_repr(self, sample_user_id, sample_sale_data):
        """Test Sale __repr__ method."""
        with patch.object(Sale, "save"):
            sale = Sale.create(user_id=sample_user_id, **sample_sale_data)

            repr_str = repr(sale)
            assert sample_user_id in repr_str
            assert sample_sale_data["security_id"] in repr_str
            assert str(sample_sale_data["amount"]) in repr_str

    def test_sale_as_dict(self, sample_user_id, sample_sale_data):
        """Test Sale as_dict method."""
        with patch.object(Sale, "save"):
            sale = Sale.create(user_id=sample_user_id, **sample_sale_data)

            sale_dict = sale.as_dict()

            assert isinstance(sale_dict, dict)
            assert sale_dict["user_id"] == sample_user_id
            assert sale_dict["security_id"] == sample_sale_data["security_id"]
            assert sale_dict["shares"] == sample_sale_data["shares"]
            assert sale_dict["price"] == sample_sale_data["price"]
            assert sale_dict["_type"] == "sale"

    @patch("services.dynamo.sale.Sale.query")
    def test_list_by_user(self, mock_query, sample_user_id):
        """Test list_by_user method."""
        mock_sales = [MagicMock(), MagicMock()]
        mock_query.return_value = mock_sales

        result = Sale.list_by_user(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id)
        assert result == mock_sales

    @patch("services.dynamo.sale.Sale.query")
    def test_list_by_security(self, mock_query, sample_user_id):
        """Test list_by_security method."""
        mock_sales = [MagicMock()]
        mock_query.return_value = mock_sales

        result = Sale.list_by_security(sample_user_id, "security:test-123")

        mock_query.assert_called_once_with(
            sample_user_id, Sale.security_id == "security:test-123"
        )
        assert result == mock_sales

    @patch("services.dynamo.sale.Sale.query")
    def test_list_by_account(self, mock_query, sample_user_id):
        """Test list_by_account method."""
        mock_sales = [MagicMock()]
        mock_query.return_value = mock_sales

        result = Sale.list_by_account(sample_user_id, "account:test-123")

        mock_query.assert_called_once_with(
            sample_user_id, Sale.account_id == "account:test-123"
        )
        assert result == mock_sales

    @patch("services.dynamo.sale.Sale.query")
    def test_list_by_date_range(self, mock_query, sample_user_id):
        """Test list_by_date_range method."""
        start_date = datetime(2023, 1, 1, tzinfo=timezone.utc)
        end_date = datetime(2023, 1, 31, tzinfo=timezone.utc)

        mock_sales = [MagicMock()]
        mock_query.return_value = mock_sales

        result = Sale.list_by_date_range(sample_user_id, start_date, end_date)

        mock_query.assert_called_once_with(
            sample_user_id, Sale.date.between(start_date, end_date)
        )
        assert result == mock_sales

    def test_sale_meta_configuration(self):
        """Test Sale Meta class configuration."""
        assert Sale.Meta.region is not None
        assert Sale.Meta.table_name is not None
        assert "sale" in Sale.Meta.table_name.lower()

    def test_sale_attributes(self):
        """Test Sale model attributes are properly defined."""
        # Test that all expected attributes exist
        assert hasattr(Sale, "user_id")
        assert hasattr(Sale, "sale_id")
        assert hasattr(Sale, "_type")
        assert hasattr(Sale, "date")
        assert hasattr(Sale, "amount")
        assert hasattr(Sale, "merchant")
        assert hasattr(Sale, "security_id")
        assert hasattr(Sale, "account_id")
        assert hasattr(Sale, "shares")
        assert hasattr(Sale, "price")
        assert hasattr(Sale, "fee")
        assert hasattr(Sale, "gains")
        assert hasattr(Sale, "losses")
        assert hasattr(Sale, "cost_basis_per_share")
        assert hasattr(Sale, "deposit_to_id")

    def test_sale_default_values(self, sample_user_id):
        """Test Sale model default values."""
        with patch.object(Sale, "save"):
            sale = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=2000.0,
                security_id="security:test-123",
                account_id="account:test-123",
            )

            assert sale._type == "sale"

    def test_sale_nullable_fields(self, sample_user_id):
        """Test Sale model nullable fields."""
        with patch.object(Sale, "save"):
            sale = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=2000.0,
                security_id="security:test-123",
                account_id="account:test-123",
                merchant=None,
                shares=None,
                price=None,
                fee=None,
                gains=None,
                losses=None,
                cost_basis_per_share=None,
                deposit_to_id=None,
            )

            assert sale.merchant is None
            assert sale.shares is None
            assert sale.price is None
            assert sale.fee is None
            assert sale.gains is None
            assert sale.losses is None
            assert sale.cost_basis_per_share is None
            assert sale.deposit_to_id is None

    def test_sale_amount_validation(self, sample_user_id):
        """Test Sale amount field validation."""
        with patch.object(Sale, "save"):
            # Test with positive amount
            sale = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=2000.0,
                security_id="security:test-123",
                account_id="account:test-123",
            )

            assert sale.amount == 2000.0

            # Test with decimal amount
            sale2 = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=1999.99,
                security_id="security:test-123",
                account_id="account:test-123",
            )

            assert sale2.amount == 1999.99

    def test_sale_date_handling(self, sample_user_id):
        """Test Sale date field handling."""
        with patch.object(Sale, "save"):
            test_date = datetime(2023, 6, 15, 14, 30, 0, tzinfo=timezone.utc)

            sale = Sale.create(
                user_id=sample_user_id,
                _date=test_date,
                amount=2000.0,
                security_id="security:test-123",
                account_id="account:test-123",
            )

            assert sale.date == test_date
            assert sale.date.tzinfo is not None

    def test_sale_gains_losses_handling(self, sample_user_id):
        """Test Sale gains and losses field handling."""
        with patch.object(Sale, "save"):
            sale = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=2000.0,
                security_id="security:test-123",
                account_id="account:test-123",
                gains=500.0,
                losses=0.0,
                cost_basis_per_share=100.0,
            )

            assert sale.gains == 500.0
            assert sale.losses == 0.0
            assert sale.cost_basis_per_share == 100.0

    def test_sale_fee_handling(self, sample_user_id):
        """Test Sale fee field handling."""
        with patch.object(Sale, "save"):
            sale = Sale.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=2000.0,
                security_id="security:test-123",
                account_id="account:test-123",
                fee=9.99,
            )

            assert sale.fee == 9.99
