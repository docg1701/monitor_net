import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { MonitorService } from '../services/monitor.service';
import { BehaviorSubject } from 'rxjs';
import { PingResult } from '../models/ping-result.interface';
import { BaseChartDirective } from 'ng2-charts';
import { IonicModule } from '@ionic/angular';

describe('HomePage', () => {
  let component: HomePage;
  let fixture: ComponentFixture<HomePage>;
  let monitorServiceSpy: jasmine.SpyObj<MonitorService>;
  let resultsSubject: BehaviorSubject<PingResult[]>;
  let mediaQueryListMock: any;

  beforeEach(async () => {
    resultsSubject = new BehaviorSubject<PingResult[]>([]);
    monitorServiceSpy = jasmine.createSpyObj('MonitorService', ['startMonitoring', 'stopMonitoring'], {
      results$: resultsSubject.asObservable()
    });

    mediaQueryListMock = {
      matches: false,
      addEventListener: jasmine.createSpy('addEventListener'),
      removeEventListener: jasmine.createSpy('removeEventListener')
    };

    spyOn(window, 'matchMedia').and.returnValue(mediaQueryListMock);

    await TestBed.configureTestingModule({
      imports: [HomePage, IonicModule.forRoot(), BaseChartDirective],
      providers: [
        { provide: MonitorService, useValue: monitorServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
  });

  describe('General Functionality', () => {
    beforeEach(() => {
      // Default setup for general tests
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should have default stats', () => {
      expect(component.stats).toEqual({
        current: 0,
        avg: 0,
        min: 0,
        max: 0,
        jitter: 0
      });
    });

    it('should update stats when results are emitted', () => {
      const mockResults: PingResult[] = [
        { timestamp: new Date(), latencyMs: 10, status: 'ok' },
        { timestamp: new Date(), latencyMs: 20, status: 'ok' },
        { timestamp: new Date(), latencyMs: 30, status: 'ok' }
      ];
      resultsSubject.next(mockResults);
      
      expect(component.stats.current).toBe(30);
      expect(component.stats.avg).toBe(20);
      expect(component.stats.min).toBe(10);
      expect(component.stats.max).toBe(30);
      expect(component.stats.jitter).toBeCloseTo(1.21, 1);
    });

    it('should calculate jitter correctly', () => {
      const mockResults: PingResult[] = [
          { timestamp: new Date(), latencyMs: 10, status: 'ok' },
          { timestamp: new Date(), latencyMs: 20, status: 'ok' },
          { timestamp: new Date(), latencyMs: 10, status: 'ok' }
        ];
        
        resultsSubject.next(mockResults);
        expect(component.stats.jitter).toBeCloseTo(1.2109375, 4);
    });

    it('should call startMonitoring when button clicked', () => {
      component.isMonitoring = false;
      component.toggleMonitoring();
      expect(monitorServiceSpy.startMonitoring).toHaveBeenCalled();
      expect(component.isMonitoring).toBeTrue();
    });

    it('should call stopMonitoring when button clicked if already monitoring', () => {
      component.isMonitoring = true;
      component.toggleMonitoring();
      expect(monitorServiceSpy.stopMonitoring).toHaveBeenCalled();
      expect(component.isMonitoring).toBeFalse();
    });
  });

  describe('Theme Logic', () => {
    beforeEach(() => {
      spyOn(localStorage, 'getItem');
      spyOn(localStorage, 'setItem');
    });

    it('should default to system light theme if no local storage', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      mediaQueryListMock.matches = false; // Light
      
      fixture.detectChanges(); // Triggers ngOnInit

      expect(component.isDark).toBeFalse();
      expect(document.body.classList.contains('ion-palette-dark')).toBeFalse();
      expect(window.matchMedia).toHaveBeenCalledWith('(prefers-color-scheme: dark)');
    });

    it('should default to system dark theme if no local storage', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      mediaQueryListMock.matches = true; // Dark
      
      fixture.detectChanges();

      expect(component.isDark).toBeTrue();
      expect(document.body.classList.contains('ion-palette-dark')).toBeTrue();
    });
    
    it('should respect local storage over system', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue('light');
      mediaQueryListMock.matches = true; // System is Dark
      
      fixture.detectChanges();

      expect(component.isDark).toBeFalse(); // Should be light per storage
      expect(document.body.classList.contains('ion-palette-dark')).toBeFalse();
    });

    it('should toggle theme and save to local storage', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      mediaQueryListMock.matches = false;
      fixture.detectChanges();

      component.toggleTheme();
      expect(component.isDark).toBeTrue();
      expect(localStorage.setItem).toHaveBeenCalledWith('netmonitor-theme', 'dark');
      
      component.toggleTheme();
      expect(component.isDark).toBeFalse();
      expect(localStorage.setItem).toHaveBeenCalledWith('netmonitor-theme', 'light');
    });

    it('should listen to system preference changes if no user preference', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);
      mediaQueryListMock.matches = false;
      fixture.detectChanges();

      // Simulate system change to dark
      const listener = mediaQueryListMock.addEventListener.calls.mostRecent().args[1];
      listener({ matches: true } as MediaQueryListEvent);

      expect(component.isDark).toBeTrue();
      expect(document.body.classList.contains('ion-palette-dark')).toBeTrue();
    });
  });
});
