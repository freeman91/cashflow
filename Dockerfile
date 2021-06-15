FROM python:3.8

RUN apt update
RUN apt install -y python3-dev python3-openssl libpq-dev
RUN pip install -U pip

RUN mkdir /appdata
WORKDIR /appdata
COPY . .

RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir -r requirements-dev.txt
RUN python setup.py install

EXPOSE 9000

CMD python run.py
