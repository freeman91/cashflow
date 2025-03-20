# CashFlow

Personal finance management application

## Description

TODO: [An in-depth paragraph about your project and overview of use]

## Getting Started

### Dependencies

- **Poetry**: python package manager
- **yarn**: node package manaer
- **docker**

### Installation

- create `.env` file in the root of the project

```sh
APP_ID=cashflow
ENV=production
REACT_APP_API_URL=http://localhost:9000/
REACT_APP_USER_ID= # enter your user id after creation

FLASK_APP=run.py
POETRY_VERSION=1.1.12
PORT=4242
HOST=localhost
CRYPTO_COMPARE_KEY=

REGION=us-east-2
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
```

- install poetry & yarn packages

```sh
poetry install (--no-root)
yarn install
```

### Deploy to AWS

```sh
poetry run python aws/main.py deploy
```

### Create user item

```sh
# open workbench shell
poetry run python -i aws/main.py workbench
```

```py
>>> user = User.create(
    email="<user email>",
    name="<user's name>",
)
# add user_id to .env file
print(user.user_id)
```

### Developer Environment

```sh
# run backend & frontend containers
docker-compose up -d --build

# build and run backend container only
docker-compose up -d backend

# tail docker logs
docker-compose logs -f --tail=100

# run the frontend in dev
yarn start

# run db workbench
poetry run python -i aws/main.py workbench
```

### Production Deploy

Resources should be deployed to AWS first

```sh
# run deploy script to
# - close any existing frontend server processes
# - pull latest branch from git
# - create optimized production build of the frontend
# - serve frontend
./deploy
```

### Create Initial data

- Create Asset & Liability Accounts that you use for
  - checking
  - savings
  - digital wallet (Venmo, Cash App, etc)
  - physical cash
  - HSA
  - credit cards
  - loans
  - investments (401k, Roth IRA, crypto, etc)
    - create holdings for each of your investment accounts
  - mortgage
  - real estate
  - vehicles (each vehicle is a separate account)
- Create Recurring items for each transaction that happens with some frequency
  - expenses
  - incomes
  - paychecks
  - repayments (Loan/mortgage repayment transactions)
- When you spend or earn money create the appropriate transaction
  - expenses
  - incomes
  - paychecks
  - repayments
- When you purchase or sell an investment
  - purchase x shares of SPY
  - sell y shares of BTC
- When create a loan account also create a borrow transaction

### Setup cronjobs

There are a number of cronjobs that should run so that

- stock and crypto holding values are periodically updated
- account values are periodically saved in the History ddb table
- generate pending transactions for upcoming recurtring items

The cronjob are defined in the docstring of each endpoint handler in `aws/services/api/controllers/cronjobs.py`
