# Technical Debt and Known Issues
- **Desktop Build Bloat**: The primary technical debt being addressed is the large footprint of the Electron desktop application.
- **Electron-specific configurations**: Existing Electron configurations in `package.json` (`"build"` section) and `electron/main.js` represent debt that ties the project to Electron.
