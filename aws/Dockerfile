FROM python:3.12-slim

WORKDIR /code

RUN apt-get update && apt-get install -y python3-distutils python3-venv \
    && apt-get clean && rm -rf /var/lib/apt/lists/*

RUN pip install poetry==2.1.1

ENV POETRY_VIRTUALENVS_CREATE=false \
    POETRY_CACHE_DIR=/tmp/poetry_cache

COPY pyproject.toml poetry.lock ./
RUN poetry install --no-ansi --no-root --without dev && rm -rf $POETRY_CACHE_DIR

COPY . .
EXPOSE 9000

# Command to run the Flask app
CMD ["python", "aws/main.py", "run_api", "-q"]
