"""Tests for the Income PynamoDB model."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

# Import the Income class
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.income import Income


class TestIncome:
    """Test cases for Income model functionality."""

    def test_income_creation(self, sample_user_id, sample_income_data):
        """Test Income model creation with valid data."""
        with patch.object(Income, "save") as mock_save:
            income = Income.create(user_id=sample_user_id, **sample_income_data)

            assert income.user_id == sample_user_id
            assert income.date == sample_income_data["date"]
            assert income.amount == sample_income_data["amount"]
            assert income.source == sample_income_data["source"]
            assert income.category == sample_income_data["category"]
            assert income.deposit_to_id == sample_income_data["deposit_to_id"]
            assert income.description == sample_income_data["description"]
            assert income.pending is False
            assert income._type == "income"
            mock_save.assert_called_once()

    def test_income_creation_with_minimal_data(self, sample_user_id):
        """Test Income model creation with minimal required data."""
        with patch.object(Income, "save") as mock_save:
            income = Income.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=3000.0,
                source="Test Company",
            )

            assert income.user_id == sample_user_id
            assert income.amount == 3000.0
            assert income.source == "Test Company"
            assert income.pending is False
            assert income._type == "income"
            mock_save.assert_called_once()

    def test_income_creation_with_recurring_id(
        self, sample_user_id, sample_income_data
    ):
        """Test Income model creation with recurring_id."""
        with patch.object(Income, "save") as mock_save:
            income_data = sample_income_data.copy()
            income_data["recurring_id"] = "recurring:test-123"

            income = Income.create(user_id=sample_user_id, **income_data)

            assert income.recurring_id == "recurring:test-123"
            mock_save.assert_called_once()

    def test_income_repr(self, sample_user_id, sample_income_data):
        """Test Income __repr__ method."""
        with patch.object(Income, "save"):
            income = Income.create(user_id=sample_user_id, **sample_income_data)

            repr_str = repr(income)
            assert sample_user_id in repr_str
            assert sample_income_data["source"] in repr_str
            assert str(sample_income_data["amount"]) in repr_str

    def test_income_as_dict(self, sample_user_id, sample_income_data):
        """Test Income as_dict method."""
        with patch.object(Income, "save"):
            income = Income.create(user_id=sample_user_id, **sample_income_data)

            income_dict = income.as_dict()

            assert isinstance(income_dict, dict)
            assert income_dict["user_id"] == sample_user_id
            assert income_dict["amount"] == sample_income_data["amount"]
            assert income_dict["source"] == sample_income_data["source"]
            assert income_dict["category"] == sample_income_data["category"]
            assert income_dict["_type"] == "income"

    @patch("services.dynamo.income.Income.query")
    def test_list_by_user(self, mock_query, sample_user_id):
        """Test list_by_user method."""
        mock_incomes = [MagicMock(), MagicMock()]
        mock_query.return_value = mock_incomes

        result = Income.list_by_user(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id)
        assert result == mock_incomes

    @patch("services.dynamo.income.Income.query")
    def test_list_by_source(self, mock_query, sample_user_id):
        """Test list_by_source method."""
        mock_incomes = [MagicMock()]
        mock_query.return_value = mock_incomes

        result = Income.list_by_source(sample_user_id, "Test Company")

        mock_query.assert_called_once_with(
            sample_user_id, Income.source == "Test Company"
        )
        assert result == mock_incomes

    @patch("services.dynamo.income.Income.query")
    def test_list_by_category(self, mock_query, sample_user_id):
        """Test list_by_category method."""
        mock_incomes = [MagicMock()]
        mock_query.return_value = mock_incomes

        result = Income.list_by_category(sample_user_id, "Salary")

        mock_query.assert_called_once_with(sample_user_id, Income.category == "Salary")
        assert result == mock_incomes

    @patch("services.dynamo.income.Income.query")
    def test_list_pending(self, mock_query, sample_user_id):
        """Test list_pending method."""
        mock_incomes = [MagicMock()]
        mock_query.return_value = mock_incomes

        result = Income.list_pending(sample_user_id)

        mock_query.assert_called_once_with(sample_user_id, Income.pending == True)
        assert result == mock_incomes

    @patch("services.dynamo.income.Income.query")
    def test_list_by_date_range(self, mock_query, sample_user_id):
        """Test list_by_date_range method."""
        start_date = datetime(2023, 1, 1, tzinfo=timezone.utc)
        end_date = datetime(2023, 1, 31, tzinfo=timezone.utc)

        mock_incomes = [MagicMock()]
        mock_query.return_value = mock_incomes

        result = Income.list_by_date_range(sample_user_id, start_date, end_date)

        mock_query.assert_called_once_with(
            sample_user_id, Income.date.between(start_date, end_date)
        )
        assert result == mock_incomes

    def test_income_meta_configuration(self):
        """Test Income Meta class configuration."""
        assert Income.Meta.region is not None
        assert Income.Meta.table_name is not None
        assert "income" in Income.Meta.table_name.lower()

    def test_income_attributes(self):
        """Test Income model attributes are properly defined."""
        # Test that all expected attributes exist
        assert hasattr(Income, "user_id")
        assert hasattr(Income, "income_id")
        assert hasattr(Income, "_type")
        assert hasattr(Income, "date")
        assert hasattr(Income, "pending")
        assert hasattr(Income, "recurring_id")
        assert hasattr(Income, "amount")
        assert hasattr(Income, "source")
        assert hasattr(Income, "category")
        assert hasattr(Income, "deposit_to_id")
        assert hasattr(Income, "description")

    def test_income_default_values(self, sample_user_id):
        """Test Income model default values."""
        with patch.object(Income, "save"):
            income = Income.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=3000.0,
                source="Test Company",
            )

            assert income.pending is False
            assert income._type == "income"

    def test_income_nullable_fields(self, sample_user_id):
        """Test Income model nullable fields."""
        with patch.object(Income, "save"):
            income = Income.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=3000.0,
                source="Test Company",
                category=None,
                deposit_to_id=None,
                description=None,
                recurring_id=None,
            )

            assert income.category is None
            assert income.deposit_to_id is None
            assert income.description is None
            assert income.recurring_id is None

    def test_income_amount_validation(self, sample_user_id):
        """Test Income amount field validation."""
        with patch.object(Income, "save"):
            # Test with positive amount
            income = Income.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=3000.0,
                source="Test Company",
            )

            assert income.amount == 3000.0

            # Test with decimal amount
            income2 = Income.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=2999.99,
                source="Test Company",
            )

            assert income2.amount == 2999.99

    def test_income_date_handling(self, sample_user_id):
        """Test Income date field handling."""
        with patch.object(Income, "save"):
            test_date = datetime(2023, 6, 15, 14, 30, 0, tzinfo=timezone.utc)

            income = Income.create(
                user_id=sample_user_id,
                _date=test_date,
                amount=3000.0,
                source="Test Company",
            )

            assert income.date == test_date
            assert income.date.tzinfo is not None
