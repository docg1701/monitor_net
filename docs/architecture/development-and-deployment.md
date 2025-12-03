# Development and Deployment

## Local Development Setup

1.  **Prerequisites**: Python 3.8 or higher.
2.  **Virtual Environment**: `make venv` will create a virtual environment in `.venv_monitor_net/`.
3.  **Activate Venv**: `source .venv_monitor_net/bin/activate` (Linux/macOS).
4.  **Install Dependencies**: `make install-dev` will install runtime and development dependencies (including `plotext`, `pytest`, `ruff`, `black`) from `pyproject.toml` into the active virtual environment.
5.  **Run**: `python monitor_net.py` or `netmonitor` (if installed via `pip install -e .`).

## Build and Deployment Process

-   **Build**: The project is a Python package. The `pyproject.toml` defines `setuptools` as the build system and lists runtime dependencies. `pip install -e .` (editable install) or `pip install .` will make the `netmonitor` command available.
-   **Deployment**: Typically involves installing Python and `pip` dependencies on the target system and then running the script. For users, the `run_monitor.sh` and `run_monitor.bat` scripts simplify execution by handling virtual environment activation (if present) or direct execution.
-   **Environments**: The application itself does not have built-in environment management beyond reading `monitor_config.ini` or CLI overrides. Different configurations would be achieved by using different `monitor_config.ini` files or command-line arguments.
