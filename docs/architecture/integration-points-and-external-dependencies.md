# Integration Points and External Dependencies

## External Services

The application does not integrate with any external web services or APIs. Its primary external dependency is the host operating system's native `ping` command.

## Internal Integration Points

The application is largely monolithic. The `NetworkMonitor` class encapsulates all logic. Interaction points are primarily internal method calls within this class. There are no clear module-to-module integration points in the sense of separate components communicating.
