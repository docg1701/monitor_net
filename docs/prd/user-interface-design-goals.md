# User Interface Design Goals

## Overall UX Vision
The UX vision is to provide a "Native Utility" feel. The application should look and behave like a built-in system tool on both Android and Desktop. It implies simplicity, high contrast (Dark Mode), and immediate feedback. The adoption of Ionic's design system (Material Design / iOS Cupertino adaptive styles) will ensure this consistency without custom styling overhead.

## Key Interaction Paradigms
*   **Single Action Control**: The primary interaction is the "Start/Stop" toggle.
*   **Real-Time Visualization**: Passive consumption of data via the live chart and updating statistics cards.
*   **Responsive Layout**: Automatic adaptation from vertical (mobile) to grid/dashboard (desktop) layouts using Ionic Grid.

## Core Screens and Views
*   **Home Screen**: The single, primary dashboard containing:
    *   Header with Status
    *   Main Latency Chart
    *   Statistics Grid (Current, Avg, Min, Max, Jitter)
    *   Footer Control (Start/Stop Button)

## Accessibility
*   **Level**: WCAG AA
*   **Implementation**: Native Ionic components handle most accessibility attributes (ARIA labels, focus states) out of the box. High contrast from mandatory Dark Mode aids visibility.

## Branding
*   **Theme**: Strictly **Dark Mode**. The application must initialize in dark mode and potentially lock to it if system settings differ.
*   **Style**: Minimalist, utility-focused.

## Target Device and Platforms
*   **Platforms**: Cross-Platform (Android, Linux, Windows)
*   **Form Factors**: Mobile (Phone/Tablet) and Desktop (Windowed).
