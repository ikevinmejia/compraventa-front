import { afterNextRender, Component, computed, inject, input, signal } from '@angular/core';
import { CardModule } from '@openng/optimus-ui/card';
import { ChartModule } from '@openng/optimus-ui/chart';
import type { ChartData, ChartDataset, ChartOptions } from 'chart.js';
import { merge } from 'chart.js/helpers';
import { LayoutService } from '../../../features/dashboard/services/layout.service';
import { ChartTheme, readChartTheme, shadeFor } from './chart-theme';

const DATASET_DEFAULTS: Omit<ChartDataset<'bar'>, 'data'> = {
  borderRadius: { topLeft: 8, topRight: 8, bottomLeft: 0, bottomRight: 0 },
  barThickness: 32,
};
@Component({
  selector: 'app-bar-chart',
  imports: [CardModule, ChartModule],
  templateUrl: './bar-chart.html',
  styleUrl: './bar-chart.css',
})
export class BarChart {
  private layoutService = inject(LayoutService);

  private theme = signal<ChartTheme | null>(null);

  header = input<string>();
  subheader = input<string>();

  data = input.required<ChartData<'bar'>>();
  options = input<ChartOptions<'bar'>>();

  chartData = computed<ChartData<'bar'> | null>(() => {
    const theme = this.theme();
    if (!theme) return null;

    const data = this.data();

    return {
      ...data,
      datasets: data.datasets.map((dataset, index) => ({
        ...DATASET_DEFAULTS,
        backgroundColor: theme.primary[shadeFor(index, data.datasets.length)],
        ...dataset,
      })),
    };
  });

  chartOptions = computed<ChartOptions<'bar'> | null>(() => {
    const theme = this.theme();
    if (!theme) return null;

    const defaults: ChartOptions<'bar'> = {
      maintainAspectRatio: false,
      aspectRatio: 0.8,
      plugins: { legend: { labels: { color: theme.text } } },
      scales: {
        x: {
          ticks: { color: theme.textMuted },
          grid: { color: 'transparent' },
          border: { display: true },
        },
        y: {
          ticks: { color: theme.textMuted },
          grid: { color: theme.border, drawTicks: false },
          border: { display: true },
        },
      },
    };

    const merged: ChartOptions<'bar'> = merge({}, defaults);
    return merge(merged, this.options() ?? {});
  });

  constructor() {
    afterNextRender(() => this.theme.set(readChartTheme()));

    // Cuando cambie el tema claro/oscuro, vuelve a leer los colores
    // effect(() => {
    //   this.layoutService.layoutConfig().darkTheme; // solo para registrar la dependencia
    //   setTimeout(() => this.theme.set(readChartTheme()), 150);
    // });
  }
}
