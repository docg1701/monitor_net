# High Level Architecture

## Technical Summary

The `net-latency-monitor` is a Python 3 command-line interface (CLI) application designed for real-time network latency monitoring. It targets a specified host, performs periodic ICMP pings using the system's native `ping` command, and visually represents the latency data as a real-time updating graph directly within the terminal using the `plotext` library. It provides dynamic statistics including average, min, max, standard deviation, jitter, and packet loss, and can log data to a CSV file. The application is capable of handling OS-specific `ping` command variations (Linux, macOS, Windows) and supports configuration via both command-line arguments and an INI file (`monitor_config.ini`).

## Actual Tech Stack (from pyproject.toml/requirements.txt)

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

## Repository Structure Reality Check

-   **Type**: Single project repository.
-   **Package Manager**: `pip` (managed via `pyproject.toml` and `requirements.txt`).
-   **Notable**: The project includes a `Makefile` for streamlining common development tasks like virtual environment setup and running tests. It also contains platform-specific wrapper scripts (`run_monitor.sh`, `run_monitor.bat`) for convenience.
