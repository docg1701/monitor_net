# NetMonitor Enterprise (Legacy Python) Brownfield Architecture Document

## Introduction

This document captures the CURRENT STATE of the `net-latency-monitor` (Legacy Python) codebase, including its actual design, technical characteristics, known limitations, and how it currently operates. It serves as a reference for understanding the system whose functionality is being modernized and replaced by the new Angular/Ionic application described in the `NetMonitor Enterprise (Modernização) Brownfield Enhancement PRD`.

### Document Scope

Focused on the existing Python CLI codebase and its behavior, with explicit consideration of its planned replacement by an Angular/Ionic solution.

### Change Log

| Date         | Version | Description                 | Author  |
| :----------- | :------ | :-------------------------- | :------ |
| 2025-12-03   | 1.0     | Initial brownfield analysis | Winston |

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

-   **Main Entry**: `monitor_net.py` (executed via `netmonitor` script defined in `pyproject.toml`)
-   **Configuration**: `monitor_config.ini` (INI format for runtime settings)
-   **Dependencies**: `requirements.txt`, `pyproject.toml`
-   **Development Tasks**: `Makefile` (for virtual environment, testing)
-   **Tests**: `tests/test_monitor_net.py`

### Enhancement Impact Areas

The planned enhancement (NetMonitor Enterprise Modernization) involves a complete rewrite. All files and functionalities of this legacy Python project will be deprecated and replaced by the new Angular/Ionic application. There are no direct modification areas; the Python codebase serves purely as a functional reference for the new implementation.

## High Level Architecture

### Technical Summary

The `net-latency-monitor` is a Python 3 command-line interface (CLI) application designed for real-time network latency monitoring. It targets a specified host, performs periodic ICMP pings using the system's native `ping` command, and visually represents the latency data as a real-time updating graph directly within the terminal using the `plotext` library. It provides dynamic statistics including average, min, max, standard deviation, jitter, and packet loss, and can log data to a CSV file. The application is capable of handling OS-specific `ping` command variations (Linux, macOS, Windows) and supports configuration via both command-line arguments and an INI file (`monitor_config.ini`).

### Actual Tech Stack (from pyproject.toml/requirements.txt)

| Category        | Technology     | Version        | Notes                                          |
| :-------------- | :------------- | :------------- | :--------------------------------------------- |
| Runtime         | Python         | >=3.8          | Uses `platform` module for OS detection        |
| Core Libraries  | `plotext`      | >=5.0.0        | For terminal-based graphing                    |
|                 | `configparser` | Standard Library | For `monitor_config.ini` parsing               |
|                 | `subprocess`   | Standard Library | For executing system `ping` command            |
|                 | `re`           | Standard Library | For parsing `ping` command output              |
|                 | `socket`       | Standard Library | For resolving host IP                          |
|                 | `statistics`   | Standard Library | For statistical calculations (stdev, quantiles)|
|                 | `signal`       | Standard Library | For POSIX signal handling (pause/resume)       |
|                 | `termios`      | Standard Library | POSIX-specific terminal I/O control            |
| Dev Dependencies| `pytest`       | >=7.0.0        | Testing framework                              |
|                 | `pytest-mock`  | >=3.0.0        | For mocking in tests                           |
|                 | `ruff`         | >=0.1.6        | Linter                                         |
|                 | `black`        | >=22.0.0       | Code formatter                                 |

### Repository Structure Reality Check

-   **Type**: Single project repository.
-   **Package Manager**: `pip` (managed via `pyproject.toml` and `requirements.txt`).
-   **Notable**: The project includes a `Makefile` for streamlining common development tasks like virtual environment setup and running tests. It also contains platform-specific wrapper scripts (`run_monitor.sh`, `run_monitor.bat`) for convenience.

## Source Tree and Module Organization

### Project Structure (Actual)

```text
project-root/
├── .bmad-core/          # Internal BMad configuration
├── .gemini/             # Internal Gemini configuration
├── .git/                # Git repository
├── .gitignore           # Git ignore file
├── .pre-commit-config.yaml # Pre-commit hooks configuration
├── .pytest_cache/       # Pytest cache
├── .ruff_cache/         # Ruff linter cache
├── .venv_monitor_net/   # Python virtual environment
├── monitor_net.py       # Main application logic and NetworkMonitor class
├── monitor_config.ini   # Default/example configuration file
├── pyproject.toml       # Project metadata, dependencies, build config, scripts
├── requirements.txt     # Explicit list of runtime dependencies
├── Makefile             # Automation for dev setup, testing, cleaning
├── run_monitor.sh       # Shell script to execute monitor_net.py
├── run_monitor.bat      # Batch script to execute monitor_net.py
├── tests/               # Contains unit tests (e.g., test_monitor_net.py)
├── README.md            # Project README
├── ROADMAP.md           # Project roadmap
├── screenshot1.png      # Example screenshot
├── screenshot2.webp     # Example screenshot
├── working-plan.md      # Project working plan
└── docs/                # Project documentation (e.g., rescrita-tecnica-angular.md)
```

### Key Modules and Their Purpose

-   **`monitor_net.py`**: This is the core of the application. It defines the `NetworkMonitor` class, which handles:
    *   Initialization: Parsing CLI arguments, loading INI configuration, OS detection, logger setup.
    *   Ping Execution: Adapting `ping` command based on OS, executing via `subprocess`, and parsing output using regex.
    *   Data Management: Storing latency history (`latency_history_real_values`, `latency_plot_values`), managing consecutive failures.
    *   Display: Clearing terminal, plotting with `plotext`, displaying real-time statistics (average, min, max, stdev, jitter, percentiles, packet loss).
    *   Terminal Control: Hiding/showing cursor, managing terminal settings (POSIX-only).
    *   Loop Management: Main monitoring loop, pause/resume via `SIGUSR1` (POSIX-only).
    *   CSV Logging: Appending data to a CSV file if configured.
    *   CLI entry point: `main()` function handles argument parsing.
-   **`monitor_config.ini`**: Provides default or overridden configuration values for the `NetworkMonitor` class, allowing users to customize host, interval, Y-axis limits, output file, and alert threshold without command-line arguments.

## Data Models and APIs

### Data Models

The application does not use a formal database. Latency data is maintained in-memory using standard Python lists:
-   `latency_plot_values`: A `list[float]` storing latency values, with `0` representing a ping failure for consistent plotting.
-   `latency_history_real_values`: A `list[float | None]` storing actual latency values or `None` for ping failures, used for accurate statistical calculations.
-   `PingResult`: Conceptually, a single ping result is either a `float` (latency in ms) or `None` (failure).

### API Specifications

The `net-latency-monitor` does not expose any external APIs. It acts as a client, consuming the output of the local operating system's `ping` command.

## Technical Debt and Known Issues

### Critical Technical Debt

1.  **Platform-Specific `ping` Command Parsing**:
    *   **Description**: Relies on executing the external `ping` command via `subprocess` and parsing its stdout using regular expressions. This approach is highly brittle; it can break if the `ping` utility's output format changes across OS versions or distributions, or if the `ping` utility is not available or behaves unexpectedly (e.g., non-standard implementations).
    *   **Impact**: High maintenance overhead, potential for silent failures in parsing, and lack of robustness across diverse environments.
2.  **Terminal I/O and `plotext` Dependence**:
    *   **Description**: Extensive use of ANSI escape codes (`\033[...]`) and the `plotext` library for terminal-based UI. While functional, this can lead to display issues (e.g., garbled output, flickering) in non-ANSI-compliant terminals, SSH sessions without proper `TERM` settings, or when stdout is redirected.
    *   **Impact**: Limits portability and usability in headless environments or automation scripts. Difficult to debug UI rendering issues.
3.  **POSIX-Specific `termios` and `signal` Usage**:
    *   **Description**: The `termios` module (for terminal settings capture/restore) and `signal.SIGUSR1` (for pause/resume) are POSIX-specific. This limits full feature parity on Windows, where these functionalities are either unavailable or require different implementations.
    *   **Impact**: Inconsistent user experience and feature set across targeted operating systems.
4.  **No External API for Integration**:
    *   **Description**: The application is a standalone CLI tool with no programmatic interface for other applications to interact with it (e.g., retrieve data, control monitoring).
    *   **Impact**: Prevents integration into larger monitoring systems or dashboards without screen scraping or parsing its CSV output.
5.  **Direct `sys.stdout` Writes for UI Updates**:
    *   **Description**: Many critical UI updates and status messages are written directly to `sys.stdout` using `sys.stdout.write` and `sys.stdout.flush`. This bypasses standard Python logging streams for real-time display elements.
    *   **Impact**: Makes it challenging to capture all application output for logging/analysis tools, and can interfere with a structured logging approach.

### Workarounds and Gotchas

-   **`plotext.yticks` Inconsistency**: The `plotext.yticks` function can exhibit `TypeError` for certain integer counts, requiring a fallback to manual tick calculation to ensure plot rendering.
-   **Windows `SIGUSR1` Incompatibility**: The pause/resume functionality via `SIGUSR1` signal is gracefully degraded on Windows platforms, as `signal.SIGUSR1` is not available.
-   **Subprocess Timeout Calculation**: The `subprocess.run` timeout is carefully calculated (`SUBPROCESS_MIN_TIMEOUT_S_BASE` + `self.ping_interval` + `SUBPROCESS_TIMEOUT_S_ADDITIVE`) to ensure it's slightly longer than the `ping` command's internal timeout, preventing race conditions or premature process termination.
-   **Terminal Resize Behavior**: Rapid terminal resizing may cause temporary display artifacts due to the nature of ANSI escape codes and the re-rendering of `plotext`.

## Integration Points and External Dependencies

### External Services

The application does not integrate with any external web services or APIs. Its primary external dependency is the host operating system's native `ping` command.

### Internal Integration Points

The application is largely monolithic. The `NetworkMonitor` class encapsulates all logic. Interaction points are primarily internal method calls within this class. There are no clear module-to-module integration points in the sense of separate components communicating.

## Development and Deployment

### Local Development Setup

1.  **Prerequisites**: Python 3.8 or higher.
2.  **Virtual Environment**: `make venv` will create a virtual environment in `.venv_monitor_net/`.
3.  **Activate Venv**: `source .venv_monitor_net/bin/activate` (Linux/macOS).
4.  **Install Dependencies**: `make install-dev` will install runtime and development dependencies (including `plotext`, `pytest`, `ruff`, `black`) from `pyproject.toml` into the active virtual environment.
5.  **Run**: `python monitor_net.py` or `netmonitor` (if installed via `pip install -e .`).

### Build and Deployment Process

-   **Build**: The project is a Python package. The `pyproject.toml` defines `setuptools` as the build system and lists runtime dependencies. `pip install -e .` (editable install) or `pip install .` will make the `netmonitor` command available.
-   **Deployment**: Typically involves installing Python and `pip` dependencies on the target system and then running the script. For users, the `run_monitor.sh` and `run_monitor.bat` scripts simplify execution by handling virtual environment activation (if present) or direct execution.
-   **Environments**: The application itself does not have built-in environment management beyond reading `monitor_config.ini` or CLI overrides. Different configurations would be achieved by using different `monitor_config.ini` files or command-line arguments.

## Testing Reality

### Current Test Coverage

-   **Unit Tests**: Present within the `tests/` directory (e.g., `test_monitor_net.py`). `pyproject.toml` lists `pytest` as a development dependency, indicating its use.
-   **Integration Tests**: Not explicitly defined as a separate category, but some unit tests might cover integration aspects with `subprocess` (mocked).
-   **E2E Tests**: None explicitly defined in the provided structure.

### Running Tests

-   `make test`: Executes `pytest tests/` using the Python interpreter in the virtual environment (if active) or the system Python.
-   `pytest tests/`: Direct command to run tests.

## Enhancement PRD Provided - Impact Analysis

### Files That Will Need Modification

All files within the legacy Python project (`monitor_net.py`, `monitor_config.ini`, `requirements.txt`, `pyproject.toml`, `Makefile`, `tests/`) will **not** be modified. Their functionality will be entirely replaced by the new Angular/Ionic application. These files will either be archived, removed, or kept as historical reference.

### New Files/Modules Needed

The modernization project necessitates a completely new codebase, including:
-   A new Angular project structure (`src/app/`, `angular.json`, `package.json`, etc.).
-   Capacitor configuration (`capacitor.config.ts`).
-   Electron-specific files (`electron/main.js`).
-   New TypeScript models, services, components, and associated test files.

### Integration Considerations

There are no direct integration points between the legacy Python codebase and the new Angular/Ionic application. The new application is a full replacement. The only "integration" is conceptual, where the new system aims to replicate and enhance the functionality previously provided by `monitor_net.py`.

## Target Architecture (Modernization)

### Technology Stack

*   **Frontend Framework**: Angular v21+
*   **UI Library**: Ionic Framework v8+
*   **Mobile Runtime**: Capacitor v7+
*   **Desktop Runtime**: Electron v39+
*   **Visualization**: Chart.js v4.5+ (via ng2-charts)

