# Testing Reality

## Current Test Coverage

-   **Unit Tests**: Present within the `tests/` directory (e.g., `test_monitor_net.py`). `pyproject.toml` lists `pytest` as a development dependency, indicating its use.
-   **Integration Tests**: Not explicitly defined as a separate category, but some unit tests might cover integration aspects with `subprocess` (mocked).
-   **E2E Tests**: None explicitly defined in the provided structure.

## Running Tests

-   `make test`: Executes `pytest tests/` using the Python interpreter in the virtual environment (if active) or the system Python.
-   `pytest tests/`: Direct command to run tests.
