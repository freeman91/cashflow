# CLAUDE.md

## What this repo is

This is the **legacy/current production** CashFlow app: Flask API + DynamoDB
(pynamodb) backend deployed as Lambda via CDK, paired with a Create React App
frontend (MUI + Redux Toolkit) at the repo root. `cashflow-backend` (sibling
repo) is a from-scratch rewrite of the data/API layer onto Aurora — new work
generally belongs there, not here, unless explicitly fixing/maintaining this
legacy app.

## Gotchas not obvious from the code

- **Poetry dependency groups matter for install target.** `pyproject.toml`
  splits deps into groups: base (Flask app), `lambda` (pynamodb, cryptocompare,
  etc. — bundled into the Lambda zip/layer), `dev` (aws-cdk-lib, black,
  pylint — CDK/lint tooling for host-side deploy only), `docker` (boto3).
  The backend Docker image installs with `poetry install --without dev`
  (see `aws/Dockerfile`) — the `dev` group is intentionally never installed
  in containers. Bare `poetry install` on a fresh host installs everything.

- **README's cronjob description is stale.** `README.md` says cronjobs are
  "defined in the docstring of each endpoint handler in
  `aws/services/api/controllers/cronjobs.py`" and to keep the dev machine
  awake for them to run. That file doesn't exist. Cronjobs are actually
  standalone Lambda functions in `aws/src/lambdas/` (e.g.
  `update_stock_prices.py`, `generate_transactions.py`,
  `save_value_histories.py`, `daily_notification.py`,
  `update_real_estate_values.py`), scheduled by EventBridge rules defined in
  `aws/cdk/stacks/cronjobs_stack.py`. They run in AWS on their own schedule
  once deployed — no always-on local machine required.

- **`notes.json`** at repo root holds the canonical enum lists for
  transaction types, security types, and asset/liability account types. It
  isn't imported by any code (grepped, no references) — treat it as a
  human-reference doc for what values are valid/expected, not enforced.
