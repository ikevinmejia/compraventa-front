import { afterNextRender, Component, inject, input, signal } from '@angular/core';
import { CardModule } from '@openng/optimus-ui/card';
import { ChartModule } from '@openng/optimus-ui/chart';
import type { ChartData, ChartOptions } from 'chart.js';
import { LayoutService } from '../../../features/dashboard/services/layout.service';
@Component({
  selector: 'app-bar-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart {
  layoutService = inject(LayoutService);

  header = input<string>();
  subheader = input<string>();

  chartData = signal<ChartData<'bar'> | null>(null);
  chartOptions = signal<ChartOptions<'bar'> | null>(null);

  constructor() {
    afterNextRender(() => {
      setTimeout(() => {
        this.initChart();
      }, 150);
    });

    // effect(() => {
    //     this.layoutService.layoutConfig().darkTheme;
    //     setTimeout(() => {
    //         this.initChart();
    //     }, 150);
    // });
  }

  initChart() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const borderColor = documentStyle.getPropertyValue('--surface-border');
    const textMutedColor = documentStyle.getPropertyValue('--text-color-secondary');

    this.chartData.set({
      labels: ['Q1', 'Q2', 'Q3', 'Q4'],
      datasets: [
        {
          type: 'bar',
          label: 'Subscriptions',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-400'),
          data: [4000, 10000, 15000, 4000],
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          barThickness: 32,
        },
        {
          type: 'bar',
          label: 'Advertising',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-300'),
          data: [2100, 8400, 2400, 7500],
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          barThickness: 32,
        },
        {
          type: 'bar',
          label: 'Affiliate',
          backgroundColor: documentStyle.getPropertyValue('--p-primary-200'),
          data: [4100, 5200, 3400, 7400],
          borderRadius: {
            topLeft: 8,
            topRight: 8,
            bottomLeft: 0,
            bottomRight: 0,
          },
          borderSkipped: false,
          barThickness: 32,
        },
      ],
    });

    this.chartOptions.set({
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          stacked: false,
          ticks: { color: textMutedColor },
          grid: { color: 'transparent' },
          border: { display: true },
        },
        y: {
          stacked: false,
          ticks: { color: textMutedColor },
          grid: { color: borderColor, drawTicks: false },
          border: { display: true },
        },
      },
    });
  }
}
