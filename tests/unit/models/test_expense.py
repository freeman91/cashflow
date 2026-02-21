"""Tests for the Expense PynamoDB model."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

# Import the Expense class
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.expense import Expense


class TestExpense:
    """Test cases for Expense model functionality."""

    def test_expense_creation(self, sample_user_id, sample_expense_data):
        """Test Expense model creation with valid data."""
        with patch.object(Expense, "save") as mock_save:
            expense = Expense.create(user_id=sample_user_id, **sample_expense_data)

            assert expense.user_id == sample_user_id
            assert expense.date == sample_expense_data["date"]
            assert expense.amount == sample_expense_data["amount"]
            assert expense.merchant == sample_expense_data["merchant"]
            assert expense.category == sample_expense_data["category"]
            assert expense.subcategory == sample_expense_data["subcategory"]
            assert expense.pending == sample_expense_data["pending"]
            assert expense.payment_from_id == sample_expense_data["payment_from_id"]
            assert expense.description == sample_expense_data["description"]
            assert expense._type == "expense"
            mock_save.assert_called_once()

    def test_expense_creation_with_minimal_data(self, sample_user_id):
        """Test Expense model creation with minimal required data."""
        with patch.object(Expense, "save") as mock_save:
            expense = Expense.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=100.0,
                merchant="Test Store",
                category="Food",
                subcategory="Groceries",
            )

            assert expense.user_id == sample_user_id
            assert expense.amount == 100.0
            assert expense.merchant == "Test Store"
            assert expense.category == "Food"
            assert expense.subcategory == "Groceries"
            assert expense.pending is False
            assert expense._type == "expense"
            mock_save.assert_called_once()

    def test_expense_creation_with_recurring_id(
        self, sample_user_id, sample_expense_data
    ):
        """Test Expense model creation with recurring_id."""
        with patch.object(Expense, "save") as mock_save:
            expense_data = sample_expense_data.copy()
            expense_data["recurring_id"] = "recurring:test-123"

            expense = Expense.create(user_id=sample_user_id, **expense_data)

            assert expense.recurring_id == "recurring:test-123"
            mock_save.assert_called_once()

    def test_expense_repr(self, sample_user_id, sample_expense_data):
        """Test Expense __repr__ method."""
        with patch.object(Expense, "save"):
            expense = Expense.create(user_id=sample_user_id, **sample_expense_data)

            repr_str = repr(expense)
            assert sample_user_id in repr_str
            assert sample_expense_data["merchant"] in repr_str
            assert str(sample_expense_data["amount"]) in repr_str

    def test_expense_as_dict(self, sample_user_id, sample_expense_data):
        """Test Expense as_dict method."""
        with patch.object(Expense, "save"):
            expense = Expense.create(user_id=sample_user_id, **sample_expense_data)

            expense_dict = expense.as_dict()

            assert isinstance(expense_dict, dict)
            assert expense_dict["user_id"] == sample_user_id
            assert expense_dict["amount"] == sample_expense_data["amount"]
            assert expense_dict["merchant"] == sample_expense_data["merchant"]
            assert expense_dict["category"] == sample_expense_data["category"]
            assert expense_dict["subcategory"] == sample_expense_data["subcategory"]
            assert expense_dict["_type"] == "expense"

    @patch("services.dynamo.expense.Expense.query")
    def test_list_by_user(self, mock_query, sample_user_id):
        """Test list_by_user method."""
        mock_expenses = [MagicMock(), MagicMock()]
        mock_query.return_value = mock_expenses

        result = Expense.list_by_user(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id)
        assert result == mock_expenses

    @patch("services.dynamo.expense.Expense.query")
    def test_list_by_category(self, mock_query, sample_user_id):
        """Test list_by_category method."""
        mock_expenses = [MagicMock()]
        mock_query.return_value = mock_expenses

        result = Expense.list_by_category(sample_user_id, "Food")

        mock_query.assert_called_once_with(sample_user_id, Expense.category == "Food")
        assert result == mock_expenses

    @patch("services.dynamo.expense.Expense.query")
    def test_list_by_merchant(self, mock_query, sample_user_id):
        """Test list_by_merchant method."""
        mock_expenses = [MagicMock()]
        mock_query.return_value = mock_expenses

        result = Expense.list_by_merchant(sample_user_id, "Test Store")

        mock_query.assert_called_once_with(
            sample_user_id, Expense.merchant == "Test Store"
        )
        assert result == mock_expenses

    @patch("services.dynamo.expense.Expense.query")
    def test_list_pending(self, mock_query, sample_user_id):
        """Test list_pending method."""
        mock_expenses = [MagicMock()]
        mock_query.return_value = mock_expenses

        result = Expense.list_pending(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id, Expense.pending == True)
        assert result == mock_expenses

    @patch("services.dynamo.expense.Expense.query")
    def test_list_by_date_range(self, mock_query, sample_user_id):
        """Test list_by_date_range method."""
        start_date = datetime(2023, 1, 1, tzinfo=timezone.utc)
        end_date = datetime(2023, 1, 31, tzinfo=timezone.utc)

        mock_expenses = [MagicMock()]
        mock_query.return_value = mock_expenses

        result = Expense.list_by_date_range(sample_user_id, start_date, end_date)

        mock_query.assert_called_once_with(
            sample_user_id, Expense.date.between(start_date, end_date)
        )
        assert result == mock_expenses

    def test_expense_meta_configuration(self):
        """Test Expense Meta class configuration."""
        assert Expense.Meta.region is not None
        assert Expense.Meta.table_name is not None
        assert "expense" in Expense.Meta.table_name.lower()

    def test_expense_attributes(self):
        """Test Expense model attributes are properly defined."""
        # Test that all expected attributes exist
        assert hasattr(Expense, "user_id")
        assert hasattr(Expense, "expense_id")
        assert hasattr(Expense, "_type")
        assert hasattr(Expense, "date")
        assert hasattr(Expense, "pending")
        assert hasattr(Expense, "recurring_id")
        assert hasattr(Expense, "amount")
        assert hasattr(Expense, "merchant")
        assert hasattr(Expense, "category")
        assert hasattr(Expense, "subcategory")
        assert hasattr(Expense, "payment_from_id")
        assert hasattr(Expense, "description")

    def test_expense_default_values(self, sample_user_id):
        """Test Expense model default values."""
        with patch.object(Expense, "save"):
            expense = Expense.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=100.0,
                merchant="Test Store",
                category="Food",
                subcategory="Groceries",
            )

            assert expense.pending is False
            assert expense._type == "expense"
            assert expense.category == "Food"
            assert expense.subcategory == "Groceries"

    def test_expense_nullable_fields(self, sample_user_id):
        """Test Expense model nullable fields."""
        with patch.object(Expense, "save"):
            expense = Expense.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=100.0,
                merchant="Test Store",
                category="Food",
                subcategory="Groceries",
                payment_from_id=None,
                description=None,
                recurring_id=None,
            )

            assert expense.payment_from_id is None
            assert expense.description is None
            assert expense.recurring_id is None

    def test_expense_amount_validation(self, sample_user_id):
        """Test Expense amount field validation."""
        with patch.object(Expense, "save"):
            # Test with positive amount
            expense = Expense.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=100.0,
                merchant="Test Store",
                category="Food",
                subcategory="Groceries",
            )

            assert expense.amount == 100.0

            # Test with decimal amount
            expense2 = Expense.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=99.99,
                merchant="Test Store",
                category="Food",
                subcategory="Groceries",
            )

            assert expense2.amount == 99.99

    def test_expense_date_handling(self, sample_user_id):
        """Test Expense date field handling."""
        with patch.object(Expense, "save"):
            test_date = datetime(2023, 6, 15, 14, 30, 0, tzinfo=timezone.utc)

            expense = Expense.create(
                user_id=sample_user_id,
                _date=test_date,
                amount=100.0,
                merchant="Test Store",
                category="Food",
                subcategory="Groceries",
            )

            assert expense.date == test_date
            assert expense.date.tzinfo is not None
