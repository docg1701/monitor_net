# Integration Points and External Dependencies

## External Services
- **HTTP Latency Monitoring**: Frontend makes HTTP requests to external services for latency checks. This remains unchanged.

## Internal Integration Points
- **Frontend-to-Container**: The Angular frontend's compiled output (`www` directory) is currently served by Electron. In the new architecture, it will be served by Tauri.
- **Native OS Features**: Electron provides access to native OS features; Tauri will provide similar access via its Rust backend and plugin system.
- **Angular Configuration**: `angular.json` may require specific headers (e.g., `Cross-Origin-Opener-Policy`) to function correctly within Tauri's isolated security context.
