import { TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { MonitorService } from './monitor.service';
import { PingResult } from '../models/ping-result.interface';
import { provideHttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment'; // Import environment

describe('MonitorService', () => {
  let service: MonitorService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        MonitorService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(MonitorService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    service.stopMonitoring();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should measure latency successfully', () => {
    const dummyUrl = 'https://test.com';
    
    service.measureLatency(dummyUrl).subscribe((result: PingResult) => {
      expect(result.status).toBe('ok');
      expect(result.latencyMs).not.toBeNull();
      expect(result.latencyMs).toBeGreaterThanOrEqual(0);
    });

    const req = httpMock.expectOne(dummyUrl);
    expect(req.request.method).toBe('HEAD');
    req.flush({});
  });

  it('should handle error as packet loss', () => {
    const dummyUrl = 'https://test.com';

    service.measureLatency(dummyUrl).subscribe((result: PingResult) => {
      expect(result.status).toBe('error');
      expect(result.latencyMs).toBeNull();
    });

    const req = httpMock.expectOne(dummyUrl);
    req.error(new ProgressEvent('error'));
  });

  it('should start monitoring and update results', fakeAsync(() => {
    const interval = 1000;

    service.startMonitoring(interval); // No URL parameter

    tick(); // Allow timer(0) to trigger the first request

    // First request (immediate)
    const req1 = httpMock.expectOne(environment.pingUrl); // Use environment.pingUrl for expected request
    req1.flush({});
    
    tick(interval);
    
    // Second request
    const req2 = httpMock.expectOne(environment.pingUrl); // Use environment.pingUrl for expected request
    req2.flush({});

    service.results$.subscribe(results => {
        expect(results.length).toBeGreaterThanOrEqual(2);
        expect(results[0].status).toBe('ok');
    });
    
    service.stopMonitoring();
    discardPeriodicTasks();
  }));
});

