"""Tests for the remaining PynamoDB models (Borrow, Repayment, Recurring, etc.)."""

import pytest
from unittest.mock import patch, MagicMock
from datetime import datetime, timezone

# Import the remaining model classes
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.dynamo.borrow import Borrow
from services.dynamo.repayment import Repayment
from services.dynamo.recurring import Recurring
from services.dynamo.paycheck import Paycheck
from services.dynamo.budget import Budget
from services.dynamo.audit import Audit


class TestBorrow:
    """Test cases for Borrow model functionality."""

    def test_borrow_creation(self, sample_user_id, sample_borrow_data):
        """Test Borrow model creation with valid data."""
        with patch.object(Borrow, "save") as mock_save:
            borrow = Borrow.create(user_id=sample_user_id, **sample_borrow_data)

            assert borrow.user_id == sample_user_id
            assert borrow.date == sample_borrow_data["date"]
            assert borrow.amount == sample_borrow_data["amount"]
            assert borrow.lender == sample_borrow_data["lender"]
            assert borrow.interest_rate == sample_borrow_data["interest_rate"]
            assert borrow.term_months == sample_borrow_data["term_months"]
            assert borrow.deposit_to_id == sample_borrow_data["deposit_to_id"]
            assert borrow.description == sample_borrow_data["description"]
            assert borrow._type == "borrow"
            mock_save.assert_called_once()

    def test_borrow_creation_with_minimal_data(self, sample_user_id):
        """Test Borrow model creation with minimal required data."""
        with patch.object(Borrow, "save") as mock_save:
            borrow = Borrow.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=5000.0,
                lender="Test Bank",
            )

            assert borrow.user_id == sample_user_id
            assert borrow.amount == 5000.0
            assert borrow.lender == "Test Bank"
            assert borrow._type == "borrow"
            mock_save.assert_called_once()

    def test_borrow_meta_configuration(self):
        """Test Borrow Meta class configuration."""
        assert Borrow.Meta.region is not None
        assert Borrow.Meta.table_name is not None
        assert "borrow" in Borrow.Meta.table_name.lower()

    def test_borrow_attributes(self):
        """Test Borrow model attributes are properly defined."""
        assert hasattr(Borrow, "user_id")
        assert hasattr(Borrow, "borrow_id")
        assert hasattr(Borrow, "_type")
        assert hasattr(Borrow, "date")
        assert hasattr(Borrow, "amount")
        assert hasattr(Borrow, "lender")
        assert hasattr(Borrow, "interest_rate")
        assert hasattr(Borrow, "term_months")
        assert hasattr(Borrow, "deposit_to_id")
        assert hasattr(Borrow, "description")


class TestRepayment:
    """Test cases for Repayment model functionality."""

    def test_repayment_creation(self, sample_user_id, sample_repayment_data):
        """Test Repayment model creation with valid data."""
        with patch.object(Repayment, "save") as mock_save:
            repayment = Repayment.create(
                user_id=sample_user_id, **sample_repayment_data
            )

            assert repayment.user_id == sample_user_id
            assert repayment.date == sample_repayment_data["date"]
            assert repayment.amount == sample_repayment_data["amount"]
            assert repayment.borrow_id == sample_repayment_data["borrow_id"]
            assert repayment.payment_from_id == sample_repayment_data["payment_from_id"]
            assert repayment.description == sample_repayment_data["description"]
            assert repayment._type == "repayment"
            mock_save.assert_called_once()

    def test_repayment_creation_with_minimal_data(self, sample_user_id):
        """Test Repayment model creation with minimal required data."""
        with patch.object(Repayment, "save") as mock_save:
            repayment = Repayment.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=200.0,
                borrow_id="borrow:test-123",
            )

            assert repayment.user_id == sample_user_id
            assert repayment.amount == 200.0
            assert repayment.borrow_id == "borrow:test-123"
            assert repayment._type == "repayment"
            mock_save.assert_called_once()

    def test_repayment_meta_configuration(self):
        """Test Repayment Meta class configuration."""
        assert Repayment.Meta.region is not None
        assert Repayment.Meta.table_name is not None
        assert "repayment" in Repayment.Meta.table_name.lower()

    def test_repayment_attributes(self):
        """Test Repayment model attributes are properly defined."""
        assert hasattr(Repayment, "user_id")
        assert hasattr(Repayment, "repayment_id")
        assert hasattr(Repayment, "_type")
        assert hasattr(Repayment, "date")
        assert hasattr(Repayment, "amount")
        assert hasattr(Repayment, "borrow_id")
        assert hasattr(Repayment, "payment_from_id")
        assert hasattr(Repayment, "description")


class TestRecurring:
    """Test cases for Recurring model functionality."""

    def test_recurring_creation(self, sample_user_id, sample_recurring_data):
        """Test Recurring model creation with valid data."""
        with patch.object(Recurring, "save") as mock_save:
            recurring = Recurring.create(
                user_id=sample_user_id, **sample_recurring_data
            )

            assert recurring.user_id == sample_user_id
            assert recurring.name == sample_recurring_data["name"]
            assert recurring.frequency == sample_recurring_data["frequency"]
            assert recurring.amount == sample_recurring_data["amount"]
            assert recurring.category == sample_recurring_data["category"]
            assert recurring.subcategory == sample_recurring_data["subcategory"]
            assert recurring.start_date == sample_recurring_data["start_date"]
            assert recurring.active == sample_recurring_data["active"]
            assert recurring._type == "recurring"
            mock_save.assert_called_once()

    def test_recurring_creation_with_minimal_data(self, sample_user_id):
        """Test Recurring model creation with minimal required data."""
        with patch.object(Recurring, "save") as mock_save:
            recurring = Recurring.create(
                user_id=sample_user_id,
                name="Monthly Salary",
                frequency="monthly",
                amount=3000.0,
                category="income",
            )

            assert recurring.user_id == sample_user_id
            assert recurring.name == "Monthly Salary"
            assert recurring.frequency == "monthly"
            assert recurring.amount == 3000.0
            assert recurring.category == "income"
            assert recurring._type == "recurring"
            mock_save.assert_called_once()

    def test_recurring_meta_configuration(self):
        """Test Recurring Meta class configuration."""
        assert Recurring.Meta.region is not None
        assert Recurring.Meta.table_name is not None
        assert "recurring" in Recurring.Meta.table_name.lower()

    def test_recurring_attributes(self):
        """Test Recurring model attributes are properly defined."""
        assert hasattr(Recurring, "user_id")
        assert hasattr(Recurring, "recurring_id")
        assert hasattr(Recurring, "_type")
        assert hasattr(Recurring, "name")
        assert hasattr(Recurring, "frequency")
        assert hasattr(Recurring, "amount")
        assert hasattr(Recurring, "category")
        assert hasattr(Recurring, "subcategory")
        assert hasattr(Recurring, "start_date")
        assert hasattr(Recurring, "end_date")
        assert hasattr(Recurring, "active")


class TestPaycheck:
    """Test cases for Paycheck model functionality."""

    def test_paycheck_creation(self, sample_user_id, sample_paycheck_data):
        """Test Paycheck model creation with valid data."""
        with patch.object(Paycheck, "save") as mock_save:
            paycheck = Paycheck.create(user_id=sample_user_id, **sample_paycheck_data)

            assert paycheck.user_id == sample_user_id
            assert paycheck.date == sample_paycheck_data["date"]
            assert paycheck.amount == sample_paycheck_data["amount"]
            assert paycheck.employer == sample_paycheck_data["employer"]
            assert paycheck.deposit_to_id == sample_paycheck_data["deposit_to_id"]
            assert paycheck.description == sample_paycheck_data["description"]
            assert paycheck._type == "paycheck"
            mock_save.assert_called_once()

    def test_paycheck_creation_with_minimal_data(self, sample_user_id):
        """Test Paycheck model creation with minimal required data."""
        with patch.object(Paycheck, "save") as mock_save:
            paycheck = Paycheck.create(
                user_id=sample_user_id,
                _date=datetime.now(timezone.utc),
                amount=3000.0,
                employer="Test Company",
            )

            assert paycheck.user_id == sample_user_id
            assert paycheck.amount == 3000.0
            assert paycheck.employer == "Test Company"
            assert paycheck._type == "paycheck"
            mock_save.assert_called_once()

    def test_paycheck_meta_configuration(self):
        """Test Paycheck Meta class configuration."""
        assert Paycheck.Meta.region is not None
        assert Paycheck.Meta.table_name is not None
        assert "paycheck" in Paycheck.Meta.table_name.lower()

    def test_paycheck_attributes(self):
        """Test Paycheck model attributes are properly defined."""
        assert hasattr(Paycheck, "user_id")
        assert hasattr(Paycheck, "paycheck_id")
        assert hasattr(Paycheck, "_type")
        assert hasattr(Paycheck, "date")
        assert hasattr(Paycheck, "amount")
        assert hasattr(Paycheck, "employer")
        assert hasattr(Paycheck, "deposit_to_id")
        assert hasattr(Paycheck, "description")


class TestBudget:
    """Test cases for Budget model functionality."""

    def test_budget_creation(self, sample_user_id, sample_budget_data):
        """Test Budget model creation with valid data."""
        with patch.object(Budget, "save") as mock_save:
            budget = Budget.create(user_id=sample_user_id, **sample_budget_data)

            assert budget.user_id == sample_user_id
            assert budget.name == sample_budget_data["name"]
            assert budget.amount == sample_budget_data["amount"]
            assert budget.category == sample_budget_data["category"]
            assert budget.subcategory == sample_budget_data["subcategory"]
            assert budget.period == sample_budget_data["period"]
            assert budget.start_date == sample_budget_data["start_date"]
            assert budget.active == sample_budget_data["active"]
            assert budget._type == "budget"
            mock_save.assert_called_once()

    def test_budget_creation_with_minimal_data(self, sample_user_id):
        """Test Budget model creation with minimal required data."""
        with patch.object(Budget, "save") as mock_save:
            budget = Budget.create(
                user_id=sample_user_id,
                name="Monthly Food Budget",
                amount=500.0,
                category="Food",
                period="monthly",
            )

            assert budget.user_id == sample_user_id
            assert budget.name == "Monthly Food Budget"
            assert budget.amount == 500.0
            assert budget.category == "Food"
            assert budget.period == "monthly"
            assert budget._type == "budget"
            mock_save.assert_called_once()

    def test_budget_meta_configuration(self):
        """Test Budget Meta class configuration."""
        assert Budget.Meta.region is not None
        assert Budget.Meta.table_name is not None
        assert "budget" in Budget.Meta.table_name.lower()

    def test_budget_attributes(self):
        """Test Budget model attributes are properly defined."""
        assert hasattr(Budget, "user_id")
        assert hasattr(Budget, "budget_id")
        assert hasattr(Budget, "_type")
        assert hasattr(Budget, "name")
        assert hasattr(Budget, "amount")
        assert hasattr(Budget, "category")
        assert hasattr(Budget, "subcategory")
        assert hasattr(Budget, "period")
        assert hasattr(Budget, "start_date")
        assert hasattr(Budget, "end_date")
        assert hasattr(Budget, "active")


class TestAudit:
    """Test cases for Audit model functionality."""

    def test_audit_creation(self, sample_user_id, sample_audit_data):
        """Test Audit model creation with valid data."""
        with patch.object(Audit, "save") as mock_save:
            audit = Audit.create(user_id=sample_user_id, **sample_audit_data)

            assert audit.user_id == sample_user_id
            assert audit.action == sample_audit_data["action"]
            assert audit.entity_type == sample_audit_data["entity_type"]
            assert audit.entity_id == sample_audit_data["entity_id"]
            assert audit.old_values == sample_audit_data["old_values"]
            assert audit.new_values == sample_audit_data["new_values"]
            assert audit.timestamp == sample_audit_data["timestamp"]
            assert audit._type == "audit"
            mock_save.assert_called_once()

    def test_audit_creation_with_minimal_data(self, sample_user_id):
        """Test Audit model creation with minimal required data."""
        with patch.object(Audit, "save") as mock_save:
            audit = Audit.create(
                user_id=sample_user_id,
                action="create",
                entity_type="account",
                entity_id="account:test-123",
            )

            assert audit.user_id == sample_user_id
            assert audit.action == "create"
            assert audit.entity_type == "account"
            assert audit.entity_id == "account:test-123"
            assert audit._type == "audit"
            mock_save.assert_called_once()

    def test_audit_meta_configuration(self):
        """Test Audit Meta class configuration."""
        assert Audit.Meta.region is not None
        assert Audit.Meta.table_name is not None
        assert "audit" in Audit.Meta.table_name.lower()

    def test_audit_attributes(self):
        """Test Audit model attributes are properly defined."""
        assert hasattr(Audit, "user_id")
        assert hasattr(Audit, "timestamp")
        assert hasattr(Audit, "_type")
        assert hasattr(Audit, "action")
        assert hasattr(Audit, "entity_type")
        assert hasattr(Audit, "entity_id")
        assert hasattr(Audit, "old_values")
        assert hasattr(Audit, "new_values")

    @patch("services.dynamo.audit.Audit.query")
    def test_list_by_date_range(self, mock_query, sample_user_id):
        """Test list_by_date_range method."""
        start_date = datetime(2023, 1, 1, tzinfo=timezone.utc)
        end_date = datetime(2023, 1, 31, tzinfo=timezone.utc)

        mock_audits = [MagicMock()]
        mock_query.return_value = mock_audits

        result = Audit.list_by_date_range(sample_user_id, start_date, end_date)

        mock_query.assert_called_once_with(
            sample_user_id, Audit.timestamp.between(start_date, end_date)
        )
        assert result == mock_audits
