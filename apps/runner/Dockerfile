ARG KRATOS_IMAGE=kratosmultiphysics/kratos-image-ci-ubuntu-22-04:latest
FROM ${KRATOS_IMAGE}

ARG KRATOS_VERSION=10.4.3
RUN python3 -m pip install --no-cache-dir "KratosMultiphysics[all]==${KRATOS_VERSION}" \
    && python3 -c "import KratosMultiphysics"

WORKDIR /runner
COPY worker.py .
ENV PYTHONUNBUFFERED=1
CMD ["python3", "/runner/worker.py"]
