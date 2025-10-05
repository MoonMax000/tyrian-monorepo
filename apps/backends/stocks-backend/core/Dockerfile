FROM python:3.12

WORKDIR /backend

COPY requirements/*.txt requirements/
RUN pip3 install -r requirements/dev.txt

COPY . .
