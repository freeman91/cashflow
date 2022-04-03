FROM python:3.10

RUN apt update
RUN apt install -y python3-dev python3-openssl libpq-dev
RUN pip install -U pip

RUN mkdir /code
WORKDIR /code
RUN pip install poetry==1.1.12

COPY . .
RUN POETRY_VIRTUALENVS_CREATE=false poetry install --no-interaction --no-ansi

EXPOSE 9000

CMD python run.py
