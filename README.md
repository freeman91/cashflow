# CashFlow

Personal finance management application

## Description

An in-depth paragraph about your project and overview of use.

## Getting Started

### Dependencies

- Poetry
- yarn
- docker

### Installing

- create `.env` file

```sh
APP_ID=cashflow
ENV=production
REGION=us-east-2
FLASK_APP=run.py
POETRY_VERSION=1.1.12
PORT=4242
HOST=localhost
REACT_APP_API_URL=http://localhost:9000/
CRYPTO_COMPARE_KEY=
REACT_APP_USER_ID=
```

- install poetry & yarn packages

```sh
poetry install (--no-root)
yarn install
```

### Executing program

- Run application in dev

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

- Run application in production

```sh
# run deploy script to
# - close any existing frontend server processes
# - pull latest branch from git
# - create optimized production build of the server
# - serve frontend
./deploy
```
