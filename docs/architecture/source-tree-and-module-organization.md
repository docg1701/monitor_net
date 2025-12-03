# Source Tree and Module Organization

## Project Structure (Actual)

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

## Key Modules and Their Purpose

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
