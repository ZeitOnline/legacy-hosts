FROM python:3 AS base

COPY . .
RUN pip3 install --trusted-host devpi.zeit.de -i http://devpi.zeit.de:4040/zeit/default/ -r /requirements.txt

# --- testing ---
FROM base AS testing
RUN pip install pytest pytest-pep8 mock
WORKDIR /test
COPY pytest.ini .
ENTRYPOINT ["pytest"]

# --- develop ---
FROM base AS develop
WORKDIR /
RUN pip install -e .
ENTRYPOINT ["pserve", "app.ini"]

# --- sdist ---
FROM base AS sdist
WORKDIR /build
COPY . .
RUN python setup.py sdist

# --- production ---
FROM base AS production
COPY --from=sdist /build/dist /dist
RUN pip install /dist/*
RUN rm -rf /dist
ENTRYPOINT ["pserve", "app.ini"]
