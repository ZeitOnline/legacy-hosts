FROM python:3 AS base

WORKDIR legacy_hosts
COPY requirements.txt requirements.txt
RUN pip3 install -i https://devpi.zeit.de/zeit/default/ -r requirements.txt
COPY setup.py setup.py
COPY src src
COPY app.ini app.ini
COPY content content

# --- testing ---
FROM base AS testing
RUN pip install pytest pytest-pep8 mock
COPY pytest.ini pytest-ini
ENTRYPOINT ["pytest"]

# --- develop ---
FROM base AS develop
WORKDIR /
RUN pip install -e legacy_hosts
ENTRYPOINT ["pserve", "legacy_hosts/app.ini"]

# --- sdist ---
FROM base AS sdist
WORKDIR /build
COPY setup.py setup.py
COPY src src
RUN python setup.py sdist

# --- production ---
FROM base AS production
COPY --from=sdist /build/dist /dist
RUN pip install /dist/*
RUN rm -rf /dist
ENTRYPOINT ["pserve", "app.ini"]
