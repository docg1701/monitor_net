# Architecture Patterns and Conventions

## Component Pattern: Hybrid Standalone/NgModule

**CRITICAL:** The project uses a **hybrid approach**:
- `AppComponent` is `standalone: false` and bootstrapped via `AppModule`
- `HomePage` is `standalone: true` and loaded via `loadComponent()`

```typescript
// app-routing.module.ts - Standalone component loading
{
  path: 'home',
  loadComponent: () => import('./home/home.page').then(m => m.HomePage)
}

// app.component.ts - NOT standalone
@Component({
  standalone: false,  // <-- Important!
})
export class AppComponent {}
```

**For new pages:** Use standalone components with `loadComponent()` to match existing pattern.

## Service Pattern: BehaviorSubject State

Services use RxJS BehaviorSubject for reactive state:

```typescript
// monitor.service.ts pattern
private _results$ = new BehaviorSubject<PingResult[]>([]);
readonly results$ = this._results$.asObservable();
```

**For new services:** Follow this pattern for reactive state management.

## Dependency Injection: Modern `inject()` Function

The HomePage uses Angular 14+ `inject()` function:

```typescript
// home.page.ts
monitorService = inject(MonitorService);
cd = inject(ChangeDetectorRef);
```

**For new components:** Use `inject()` instead of constructor injection.

## Platform Detection Pattern

```typescript
// monitor.service.ts
private isTauri(): boolean {
  return !!(window as any).__TAURI__;
}

// For Capacitor
import { Capacitor } from '@capacitor/core';
if (Capacitor.isNativePlatform()) { ... }
```

**CRITICAL:** Always check platform before using platform-specific APIs.

## Theme Pattern

Dark mode is controlled via CSS class on `<body>`:

```typescript
// home.page.ts
if (this.isDark) {
  document.body.classList.add('ion-palette-dark');
} else {
  document.body.classList.remove('ion-palette-dark');
}
```

CSS custom properties update chart colors:
```scss
// variables.scss
:root {
  --chart-line-color: #3880ff;
}
.ion-palette-dark {
  --chart-line-color: rgba(148, 159, 177, 1);
}
```

---
