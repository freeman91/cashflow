"""Tests for the remaining API controllers (Incomes, Purchases, Sales, etc.)."""

import pytest
from unittest.mock import patch, MagicMock
import json

# Import the remaining controllers
import sys
import os

sys.path.append(os.path.join(os.path.dirname(__file__), "../../../..", "aws", "src"))

from services.api.controllers.incomes import incomes
from services.api.controllers.purchases import purchases
from services.api.controllers.sales import sales
from services.api.controllers.borrows import borrows
from services.api.controllers.repayments import repayments
from services.api.controllers.recurrings import recurrings
from services.api.controllers.paychecks import paychecks
from services.api.controllers.budgets import budgets
from services.api.controllers.categories import categories
from services.api.controllers.audits import audits


class TestIncomesController:
    """Test cases for Incomes controller functionality."""

    @patch("services.api.controllers.incomes.Income.create")
    @patch("services.api.controllers.incomes.log_action")
    def test_create_income_success(
        self, mock_log_action, mock_create, sample_user_id, sample_income_data
    ):
        """Test successful income creation."""
        mock_income = MagicMock()
        mock_income.as_dict.return_value = sample_income_data
        mock_create.return_value = mock_income

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(incomes)

        with app.test_client() as client:
            response = client.post(
                f"/incomes/{sample_user_id}",
                json=sample_income_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_income_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.incomes.Income.list_by_user")
    def test_get_incomes_success(
        self, mock_list_by_user, sample_user_id, sample_income_data
    ):
        """Test successful retrieval of incomes."""
        mock_incomes = [MagicMock()]
        mock_incomes[0].as_dict.return_value = sample_income_data
        mock_list_by_user.return_value = mock_incomes

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(incomes)

        with app.test_client() as client:
            response = client.get(f"/incomes/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_income_data

            mock_list_by_user.assert_called_once_with(sample_user_id)


class TestPurchasesController:
    """Test cases for Purchases controller functionality."""

    @patch("services.api.controllers.purchases.Purchase.create")
    @patch("services.api.controllers.purchases.log_action")
    def test_create_purchase_success(
        self, mock_log_action, mock_create, sample_user_id, sample_purchase_data
    ):
        """Test successful purchase creation."""
        mock_purchase = MagicMock()
        mock_purchase.as_dict.return_value = sample_purchase_data
        mock_create.return_value = mock_purchase

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(purchases)

        with app.test_client() as client:
            response = client.post(
                f"/purchases/{sample_user_id}",
                json=sample_purchase_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_purchase_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.purchases.Purchase.list_by_user")
    def test_get_purchases_success(
        self, mock_list_by_user, sample_user_id, sample_purchase_data
    ):
        """Test successful retrieval of purchases."""
        mock_purchases = [MagicMock()]
        mock_purchases[0].as_dict.return_value = sample_purchase_data
        mock_list_by_user.return_value = mock_purchases

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(purchases)

        with app.test_client() as client:
            response = client.get(f"/purchases/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_purchase_data

            mock_list_by_user.assert_called_once_with(sample_user_id)


class TestSalesController:
    """Test cases for Sales controller functionality."""

    @patch("services.api.controllers.sales.Sale.create")
    @patch("services.api.controllers.sales.log_action")
    def test_create_sale_success(
        self, mock_log_action, mock_create, sample_user_id, sample_sale_data
    ):
        """Test successful sale creation."""
        mock_sale = MagicMock()
        mock_sale.as_dict.return_value = sample_sale_data
        mock_create.return_value = mock_sale

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(sales)

        with app.test_client() as client:
            response = client.post(
                f"/sales/{sample_user_id}",
                json=sample_sale_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_sale_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.sales.Sale.list_by_user")
    def test_get_sales_success(
        self, mock_list_by_user, sample_user_id, sample_sale_data
    ):
        """Test successful retrieval of sales."""
        mock_sales = [MagicMock()]
        mock_sales[0].as_dict.return_value = sample_sale_data
        mock_list_by_user.return_value = mock_sales

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(sales)

        with app.test_client() as client:
            response = client.get(f"/sales/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_sale_data

            mock_list_by_user.assert_called_once_with(sample_user_id)


class TestBorrowsController:
    """Test cases for Borrows controller functionality."""

    @patch("services.api.controllers.borrows.Borrow.create")
    @patch("services.api.controllers.borrows.log_action")
    def test_create_borrow_success(
        self, mock_log_action, mock_create, sample_user_id, sample_borrow_data
    ):
        """Test successful borrow creation."""
        mock_borrow = MagicMock()
        mock_borrow.as_dict.return_value = sample_borrow_data
        mock_create.return_value = mock_borrow

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(borrows)

        with app.test_client() as client:
            response = client.post(
                f"/borrows/{sample_user_id}",
                json=sample_borrow_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_borrow_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.borrows.Borrow.list_by_user")
    def test_get_borrows_success(
        self, mock_list_by_user, sample_user_id, sample_borrow_data
    ):
        """Test successful retrieval of borrows."""
        mock_borrows = [MagicMock()]
        mock_borrows[0].as_dict.return_value = sample_borrow_data
        mock_list_by_user.return_value = mock_borrows

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(borrows)

        with app.test_client() as client:
            response = client.get(f"/borrows/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_borrow_data

            mock_list_by_user.assert_called_once_with(sample_user_id)


class TestRepaymentsController:
    """Test cases for Repayments controller functionality."""

    @patch("services.api.controllers.repayments.Repayment.create")
    @patch("services.api.controllers.repayments.log_action")
    def test_create_repayment_success(
        self, mock_log_action, mock_create, sample_user_id, sample_repayment_data
    ):
        """Test successful repayment creation."""
        mock_repayment = MagicMock()
        mock_repayment.as_dict.return_value = sample_repayment_data
        mock_create.return_value = mock_repayment

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(repayments)

        with app.test_client() as client:
            response = client.post(
                f"/repayments/{sample_user_id}",
                json=sample_repayment_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_repayment_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.repayments.Repayment.list_by_user")
    def test_get_repayments_success(
        self, mock_list_by_user, sample_user_id, sample_repayment_data
    ):
        """Test successful retrieval of repayments."""
        mock_repayments = [MagicMock()]
        mock_repayments[0].as_dict.return_value = sample_repayment_data
        mock_list_by_user.return_value = mock_repayments

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(repayments)

        with app.test_client() as client:
            response = client.get(f"/repayments/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_repayment_data

            mock_list_by_user.assert_called_once_with(sample_user_id)


class TestRecurringsController:
    """Test cases for Recurrings controller functionality."""

    @patch("services.api.controllers.recurrings.Recurring.create")
    @patch("services.api.controllers.recurrings.log_action")
    def test_create_recurring_success(
        self, mock_log_action, mock_create, sample_user_id, sample_recurring_data
    ):
        """Test successful recurring creation."""
        mock_recurring = MagicMock()
        mock_recurring.as_dict.return_value = sample_recurring_data
        mock_create.return_value = mock_recurring

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(recurrings)

        with app.test_client() as client:
            response = client.post(
                f"/recurrings/{sample_user_id}",
                json=sample_recurring_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_recurring_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.recurrings.Recurring.list_by_user")
    def test_get_recurrings_success(
        self, mock_list_by_user, sample_user_id, sample_recurring_data
    ):
        """Test successful retrieval of recurrings."""
        mock_recurrings = [MagicMock()]
        mock_recurrings[0].as_dict.return_value = sample_recurring_data
        mock_list_by_user.return_value = mock_recurrings

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(recurrings)

        with app.test_client() as client:
            response = client.get(f"/recurrings/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_recurring_data

            mock_list_by_user.assert_called_once_with(sample_user_id)


class TestPaychecksController:
    """Test cases for Paychecks controller functionality."""

    @patch("services.api.controllers.paychecks.Paycheck.create")
    @patch("services.api.controllers.paychecks.log_action")
    def test_create_paycheck_success(
        self, mock_log_action, mock_create, sample_user_id, sample_paycheck_data
    ):
        """Test successful paycheck creation."""
        mock_paycheck = MagicMock()
        mock_paycheck.as_dict.return_value = sample_paycheck_data
        mock_create.return_value = mock_paycheck

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(paychecks)

        with app.test_client() as client:
            response = client.post(
                f"/paychecks/{sample_user_id}",
                json=sample_paycheck_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_paycheck_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.paychecks.Paycheck.list_by_user")
    def test_get_paychecks_success(
        self, mock_list_by_user, sample_user_id, sample_paycheck_data
    ):
        """Test successful retrieval of paychecks."""
        mock_paychecks = [MagicMock()]
        mock_paychecks[0].as_dict.return_value = sample_paycheck_data
        mock_list_by_user.return_value = mock_paychecks

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(paychecks)

        with app.test_client() as client:
            response = client.get(f"/paychecks/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_paycheck_data

            mock_list_by_user.assert_called_once_with(sample_user_id)


class TestBudgetsController:
    """Test cases for Budgets controller functionality."""

    @patch("services.api.controllers.budgets.Budget.create")
    @patch("services.api.controllers.budgets.log_action")
    def test_create_budget_success(
        self, mock_log_action, mock_create, sample_user_id, sample_budget_data
    ):
        """Test successful budget creation."""
        mock_budget = MagicMock()
        mock_budget.as_dict.return_value = sample_budget_data
        mock_create.return_value = mock_budget

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(budgets)

        with app.test_client() as client:
            response = client.post(
                f"/budgets/{sample_user_id}",
                json=sample_budget_data,
                content_type="application/json",
            )

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert response_data["result"] == sample_budget_data

            mock_create.assert_called_once()
            mock_log_action.assert_called_once()

    @patch("services.api.controllers.budgets.Budget.list_by_user")
    def test_get_budgets_success(
        self, mock_list_by_user, sample_user_id, sample_budget_data
    ):
        """Test successful retrieval of budgets."""
        mock_budgets = [MagicMock()]
        mock_budgets[0].as_dict.return_value = sample_budget_data
        mock_list_by_user.return_value = mock_budgets

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(budgets)

        with app.test_client() as client:
            response = client.get(f"/budgets/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_budget_data

            mock_list_by_user.assert_called_once_with(sample_user_id)


class TestCategoriesController:
    """Test cases for Categories controller functionality."""

    @patch("services.api.controllers.categories.Categories.list")
    def test_get_categories_success(self, mock_list, sample_user_id):
        """Test successful retrieval of categories."""
        mock_categories = [MagicMock(), MagicMock()]
        mock_categories[0].as_dict.return_value = {
            "name": "Food",
            "label": "Food & Dining",
        }
        mock_categories[1].as_dict.return_value = {
            "name": "Transportation",
            "label": "Transportation",
        }
        mock_list.return_value = mock_categories

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(categories)

        with app.test_client() as client:
            response = client.get(f"/categories/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 2

            mock_list.assert_called_once_with(user_id=sample_user_id)


class TestAuditsController:
    """Test cases for Audits controller functionality."""

    @patch("services.api.controllers.audits.Audit.list_by_user")
    def test_get_audits_success(
        self, mock_list_by_user, sample_user_id, sample_audit_data
    ):
        """Test successful retrieval of audits."""
        mock_audits = [MagicMock()]
        mock_audits[0].as_dict.return_value = sample_audit_data
        mock_list_by_user.return_value = mock_audits

        from flask import Flask

        app = Flask(__name__)
        app.register_blueprint(audits)

        with app.test_client() as client:
            response = client.get(f"/audits/{sample_user_id}")

            assert response.status_code == 200
            response_data = json.loads(response.data)
            assert len(response_data["result"]) == 1
            assert response_data["result"][0] == sample_audit_data

            mock_list_by_user.assert_called_once_with(sample_user_id)
