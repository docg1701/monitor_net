import { Component, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { sunnyOutline, moonOutline } from 'ionicons/icons';
import { BaseChartDirective } from 'ng2-charts';
import { ChartConfiguration, ChartOptions, ChartType, Chart, registerables } from 'chart.js';
import { Subscription } from 'rxjs';
import { MonitorService } from '../services/monitor.service';
import { PingResult } from '../models/ping-result.interface';

Chart.register(...registerables);

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, BaseChartDirective]
})
export class HomePage implements OnInit, OnDestroy {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;

  monitorService = inject(MonitorService);
  cd = inject(ChangeDetectorRef);
  results: PingResult[] = [];
  subscription: Subscription | null = null;
  isMonitoring = false;
  isDark = false;
  private themeQuery: MediaQueryList | null = null;
  private themeListener: ((e: MediaQueryListEvent) => void) | null = null;

  constructor() {
    addIcons({ sunnyOutline, moonOutline });
  }

  stats = {
    current: 0,
    avg: 0,
    min: 0,
    max: 0,
    jitter: 0
  };

  public lineChartData: ChartConfiguration<'line'>['data'] = {
    labels: [],
    datasets: [
      {
        data: [],
        label: 'Latency (ms)',
        fill: true,
        tension: 0.5,
        borderColor: 'rgba(148,159,177,1)', // Default fallback
        backgroundColor: 'rgba(148,159,177,0.2)' // Default fallback
      }
    ]
  };
  public lineChartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false, // Disable animation for real-time feel
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };
  public lineChartLegend = true;



  ngOnInit() {
    this.initializeTheme();

    this.subscription = this.monitorService.results$.subscribe(results => {
      this.results = results;
      this.updateStats(results);
      this.updateChart(results);
      this.cd.detectChanges(); // Force UI update
    });
  }

  private initializeTheme() {
    this.themeQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Define listener
    this.themeListener = (e: MediaQueryListEvent) => {
      const savedTheme = localStorage.getItem('netmonitor-theme');
      if (!savedTheme) {
        this.setTheme(e.matches);
      }
    };

    // Add listener
    this.themeQuery.addEventListener('change', this.themeListener);

    // Initial check
    const savedTheme = localStorage.getItem('netmonitor-theme');
    if (savedTheme) {
      this.setTheme(savedTheme === 'dark');
    } else {
      this.setTheme(this.themeQuery.matches);
    }
  }

  private setTheme(isDark: boolean) {
    this.isDark = isDark;
    if (this.isDark) {
      document.body.classList.add('ion-palette-dark');
    } else {
      document.body.classList.remove('ion-palette-dark');
    }
    
    // Wait for style application
    setTimeout(() => {
        this.updateChartTheme();
        this.chart?.update();
    }, 0);
  }

  toggleTheme() {
    const newIsDark = !this.isDark;
    this.setTheme(newIsDark);
    localStorage.setItem('netmonitor-theme', newIsDark ? 'dark' : 'light');
  }

  private updateChartTheme() {
    const style = getComputedStyle(document.body);
    const lineColor = style.getPropertyValue('--chart-line-color').trim();
    const fillColor = style.getPropertyValue('--chart-fill-color').trim();

    if (lineColor) {
      this.lineChartData.datasets[0].borderColor = lineColor;
    }
    if (fillColor) {
      this.lineChartData.datasets[0].backgroundColor = fillColor;
    }
  }

  ngOnDestroy() {
    if (this.themeQuery && this.themeListener) {
      this.themeQuery.removeEventListener('change', this.themeListener);
    }
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
    this.stopMonitoring();
  }

  toggleMonitoring() {
    if (this.isMonitoring) {
      this.stopMonitoring();
    } else {
      this.startMonitoring();
    }
  }

  startMonitoring() {
    this.isMonitoring = true;
    this.monitorService.startMonitoring(1000); // Default 1s interval
  }

  stopMonitoring() {
    this.isMonitoring = false;
    this.monitorService.stopMonitoring();
  }

  private updateStats(results: PingResult[]) {
    const validResults = results.filter(r => r.status === 'ok' && r.latencyMs !== null);
    const latencies = validResults.map(r => r.latencyMs as number);

    if (latencies.length > 0) {
      this.stats = {
        current: latencies[latencies.length - 1],
        avg: latencies.reduce((a, b) => a + b, 0) / latencies.length,
        min: Math.min(...latencies),
        max: Math.max(...latencies),
        jitter: this.calculateJitter(latencies)
      };
    } else {
      this.stats = { current: 0, avg: 0, min: 0, max: 0, jitter: 0 };
    }
  }

  private calculateJitter(latencies: number[]): number {
    if (latencies.length < 2) return 0;

    let jitter = 0;
    for (let i = 1; i < latencies.length; i++) {
      const diff = Math.abs(latencies[i] - latencies[i-1]);
      jitter += (diff - jitter) / 16.0;
    }
    return jitter;
  }

  private updateChart(results: PingResult[]) {
    // Update labels and data
    this.lineChartData.labels = results.map(r => r.timestamp.toLocaleTimeString());
    this.lineChartData.datasets[0].data = results.map(r => r.latencyMs || 0);

    this.chart?.update();
  }
}