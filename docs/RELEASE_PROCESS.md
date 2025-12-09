# Release Process

This document describes how to create and publish a new release of the NetMonitor application.

## Prerequisites

- Access to the GitHub repository with write permissions.
- The `GITHUB_TOKEN` secret is automatically provided by GitHub Actions.
- **Mobile Signing Secrets** (for automated builds):
    - `ANDROID_KEYSTORE_BASE64`: Base64 encoded content of `release-keystore.jks`.
    - `ANDROID_KEYSTORE_PASSWORD`: Password for the keystore.
    - `ANDROID_KEY_ALIAS`: Alias of the signing key.
    - `ANDROID_KEY_PASSWORD`: Password for the signing key.

## Steps to Release

1.  **Update Version**:
    -   Update the `version` field in `package.json`.
    -   Update the `version` field in `src-tauri/tauri.conf.json`.
    -   Update the `versionName` and `versionCode` in `netmonitor/android/app/build.gradle`.
    -   Commit these changes: `git commit -am "chore: bump version to vX.Y.Z"`.

2.  **Tag the Release**:
    -   Create a new git tag matching the version number (prefixed with `v`).
    -   Example: `git tag v1.0.0`
    -   Push the tag to GitHub: `git push origin v1.0.0`

3.  **Monitor Build**:
    -   Go to the "Actions" tab in the GitHub repository.
    -   Verify that the "Release" workflow has been triggered by the pushed tag.
    -   Wait for the `release-linux`, `release-windows`, `release-macos`, and `release-android` jobs to complete.

4.  **Verify Release**:
    -   Once the workflow is successful, go to the "Releases" section of the repository.
    -   A new draft release should be created with the tag name.
    -   Verify that the following artifacts are attached:
        -   Linux: `.AppImage`, `.deb`
        -   Windows: `.exe` (setup), `.msi`
        -   macOS: `.app`, `.dmg`
        -   Android: `.apk`, `.aab`

5.  **Publish**:
    -   Edit the release draft to add release notes/changelog.
    -   Click "Publish release" to make it public.

## Notes

-   **Signing**: Currently, artifacts are generated with default signatures or self-signing where applicable. macOS builds are not notarized in this workflow.
-   **Draft Releases**: The workflow is configured to create a *draft* release (`releaseDraft: true`). You must manually publish it.

## Mobile Build Details

### Android
- **Automated**: The GitHub Action `release-android` will build and sign the APK/AAB if the secrets are present.
- **Manual**:
    1. Ensure you have a `release-keystore.jks` in `netmonitor/android/app/`.
    2. Run `cd netmonitor && npx cap sync android`.
    3. Run `cd android && ./gradlew assembleRelease bundleRelease`.
    4. Artifacts will be in `netmonitor/android/app/build/outputs/apk/release/` and `bundle/release/`.

### iOS
- **Manual Only**:
    1. Run `cd netmonitor && npx cap sync ios`.
    2. Run `npx cap open ios` to open Xcode.
    3. Select "Any iOS Device (arm64)" as the build target.
    4. Go to **Product > Archive**.
    5. Once archived, verify and distribute via TestFlight or export the `.ipa` manually.
    6. Upload the `.ipa` to the GitHub Release assets manually if desired.