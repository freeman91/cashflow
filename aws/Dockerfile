FROM python:3.12

WORKDIR /code
COPY . /code

RUN apt-get update && apt-get install -y python3-distutils python3-venv

RUN pip install -U pip
RUN curl -sSL https://install.python-poetry.org | python3 -

ENV PATH="/root/.local/bin:$PATH"
ENV POETRY_VIRTUALENVS_CREATE=false

RUN poetry install --no-interaction --no-ansi --no-root

EXPOSE 9000

# Command to run the Flask app
CMD ["python", "aws/main.py", "run_api", "-q"]
