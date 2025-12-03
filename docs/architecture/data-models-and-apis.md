# Data Models and APIs

## Data Models

The application does not use a formal database. Latency data is maintained in-memory using standard Python lists:
-   `latency_plot_values`: A `list[float]` storing latency values, with `0` representing a ping failure for consistent plotting.
-   `latency_history_real_values`: A `list[float | None]` storing actual latency values or `None` for ping failures, used for accurate statistical calculations.
-   `PingResult`: Conceptually, a single ping result is either a `float` (latency in ms) or `None` (failure).

## API Specifications

The `net-latency-monitor` does not expose any external APIs. It acts as a client, consuming the output of the local operating system's `ping` command.
