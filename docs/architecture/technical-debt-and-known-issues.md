# Technical Debt and Known Issues

## Critical Technical Debt

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

## Workarounds and Gotchas

-   **`plotext.yticks` Inconsistency**: The `plotext.yticks` function can exhibit `TypeError` for certain integer counts, requiring a fallback to manual tick calculation to ensure plot rendering.
-   **Windows `SIGUSR1` Incompatibility**: The pause/resume functionality via `SIGUSR1` signal is gracefully degraded on Windows platforms, as `signal.SIGUSR1` is not available.
-   **Subprocess Timeout Calculation**: The `subprocess.run` timeout is carefully calculated (`SUBPROCESS_MIN_TIMEOUT_S_BASE` + `self.ping_interval` + `SUBPROCESS_TIMEOUT_S_ADDITIVE`) to ensure it's slightly longer than the `ping` command's internal timeout, preventing race conditions or premature process termination.
-   **Terminal Resize Behavior**: Rapid terminal resizing may cause temporary display artifacts due to the nature of ANSI escape codes and the re-rendering of `plotext`.
