# Cashflow Test Suite

This directory contains comprehensive tests for the Cashflow application, including unit tests for PynamoDB models and API controllers, as well as integration tests.

## Test Structure

```
tests/
├── conftest.py                          # Shared pytest configuration and fixtures
├── utils.py                             # Test utilities and helper functions
├── pytest.ini                          # Pytest configuration
├── unit/
│   ├── models/                          # Unit tests for PynamoDB models
│   │   ├── test_base.py                 # Tests for BaseModel
│   │   ├── test_account.py              # Tests for Account model
│   │   ├── test_user.py                 # Tests for User model
│   │   ├── test_expense.py              # Tests for Expense model
│   │   ├── test_income.py               # Tests for Income model
│   │   ├── test_security.py             # Tests for Security model
│   │   ├── test_purchase.py             # Tests for Purchase model
│   │   ├── test_sale.py                 # Tests for Sale model
│   │   └── test_remaining_models.py     # Tests for remaining models
│   └── controllers/                     # Unit tests for API controllers
│       ├── test_accounts_controller.py  # Tests for Accounts controller
│       ├── test_users_controller.py     # Tests for Users controller
│       ├── test_expenses_controller.py  # Tests for Expenses controller
│       ├── test_securities_controller.py # Tests for Securities controller
│       └── test_remaining_controllers.py # Tests for remaining controllers
└── integration/
    └── test_integration.py              # Integration tests
```

## Running Tests

### Prerequisites

Make sure you have installed the test dependencies:

```bash
poetry install --with dev
```

### Running All Tests

```bash
pytest
```

### Running Specific Test Categories

```bash
# Run only unit tests
pytest tests/unit/

# Run only integration tests
pytest tests/integration/

# Run only model tests
pytest tests/unit/models/

# Run only controller tests
pytest tests/unit/controllers/
```

### Running Tests with Coverage

```bash
pytest --cov=aws/src/services --cov-report=html --cov-report=term-missing
```

This will generate:

- Terminal coverage report
- HTML coverage report in `htmlcov/` directory

### Running Tests with Verbose Output

```bash
pytest -v
```

### Running Specific Test Files

```bash
# Run tests for a specific model
pytest tests/unit/models/test_account.py

# Run tests for a specific controller
pytest tests/unit/controllers/test_accounts_controller.py
```

### Running Tests with Markers

```bash
# Run only unit tests
pytest -m unit

# Run only integration tests
pytest -m integration

# Run only DynamoDB-related tests
pytest -m dynamodb
```

## Test Configuration

### Environment Variables

The tests automatically set the following environment variables:

- `ENV=test`
- `REGION=us-east-1`
- `APP_ID=cashflow-test`

### Fixtures

The `conftest.py` file provides shared fixtures for:

- Sample user IDs, account IDs, expense IDs, etc.
- Sample data for all model types
- Mock DynamoDB operations
- Flask test client setup

### Mocking Strategy

Tests use extensive mocking to avoid dependencies on actual AWS services:

- DynamoDB operations are mocked using `unittest.mock`
- Flask test client is used for API testing
- All external dependencies are mocked

## Test Coverage

The test suite covers:

### PynamoDB Models

- ✅ BaseModel functionality
- ✅ Account model (creation, retrieval, updates, validation)
- ✅ User model (creation, retrieval, updates, password handling)
- ✅ Expense model (creation, retrieval, filtering, validation)
- ✅ Income model (creation, retrieval, filtering, validation)
- ✅ Security model (creation, retrieval, updates, validation)
- ✅ Purchase model (creation, retrieval, filtering, validation)
- ✅ Sale model (creation, retrieval, filtering, validation)
- ✅ Borrow model (creation, retrieval, validation)
- ✅ Repayment model (creation, retrieval, validation)
- ✅ Recurring model (creation, retrieval, validation)
- ✅ Paycheck model (creation, retrieval, validation)
- ✅ Budget model (creation, retrieval, validation)
- ✅ Audit model (creation, retrieval, filtering)

### API Controllers

- ✅ Accounts controller (CRUD operations, validation, error handling)
- ✅ Users controller (GET, PUT operations, password security)
- ✅ Expenses controller (CRUD operations, filtering, validation)
- ✅ Securities controller (CRUD operations, filtering, validation)
- ✅ Incomes controller (CRUD operations, filtering, validation)
- ✅ Purchases controller (CRUD operations, filtering, validation)
- ✅ Sales controller (CRUD operations, filtering, validation)
- ✅ Borrows controller (CRUD operations, validation)
- ✅ Repayments controller (CRUD operations, validation)
- ✅ Recurrings controller (CRUD operations, validation)
- ✅ Paychecks controller (CRUD operations, validation)
- ✅ Budgets controller (CRUD operations, validation)
- ✅ Categories controller (GET operations)
- ✅ Audits controller (GET operations)

### Integration Tests

- ✅ Application initialization
- ✅ Complete user workflows (user → account → expense)
- ✅ Security and purchase workflows
- ✅ Income and borrow workflows
- ✅ Error handling across the application
- ✅ CORS headers
- ✅ JSON content type handling
- ✅ Response format consistency

## Test Utilities

### MockDynamoDBItem

A utility class for creating mock DynamoDB items for testing.

### MockDynamoDBQuery

A utility class for creating mock DynamoDB query results.

### Test Data Generators

Functions for creating consistent test data:

- `create_test_user_data()`
- `create_test_account_data()`
- `create_test_expense_data()`
- `create_test_income_data()`
- `create_test_security_data()`
- And more...

## Best Practices

1. **Isolation**: Each test is independent and doesn't rely on other tests
2. **Mocking**: All external dependencies are mocked
3. **Data Consistency**: Use fixtures and utility functions for consistent test data
4. **Error Testing**: Both success and failure scenarios are tested
5. **Edge Cases**: Boundary conditions and edge cases are covered
6. **Documentation**: Tests are well-documented with clear descriptions

## Adding New Tests

When adding new tests:

1. **Follow the naming convention**: `test_*.py`
2. **Use appropriate fixtures**: Leverage existing fixtures in `conftest.py`
3. **Mock external dependencies**: Don't make actual AWS calls
4. **Test both success and failure cases**: Cover error scenarios
5. **Use descriptive test names**: Make it clear what each test does
6. **Add docstrings**: Document the purpose of each test class and method

## Continuous Integration

These tests are designed to run in CI/CD pipelines:

- No external dependencies (AWS, databases, etc.)
- Fast execution
- Comprehensive coverage
- Clear pass/fail indicators

## Troubleshooting

### Common Issues

1. **Import Errors**: Make sure the Python path includes the `aws/src` directory
2. **Missing Fixtures**: Ensure `conftest.py` is in the test directory
3. **Mock Failures**: Check that mocks are properly configured
4. **Environment Variables**: Tests automatically set required env vars

### Debug Mode

Run tests with debug output:

```bash
pytest -v -s --tb=long
```

This will show:

- Verbose output (`-v`)
- Print statements (`-s`)
- Long traceback format (`--tb=long`)
