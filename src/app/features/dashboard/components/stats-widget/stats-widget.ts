import { Component } from '@angular/core';
import { CardModule } from '@openng/optimus-ui/card';
import { Kpi } from '../../models/dashboard.interface';

type KpiColor = 'blue' | 'green' | 'orange' | 'purple' | 'red';

const COLOR_CLASSES: Record<KpiColor, { bg: string; text: string }> = {
  blue: { bg: 'bg-blue-100 dark:bg-blue-400/10', text: 'text-blue-500' },
  green: { bg: 'bg-green-100 dark:bg-green-400/10', text: 'text-green-500' },
  orange: { bg: 'bg-orange-100 dark:bg-orange-400/10', text: 'text-orange-500' },
  purple: { bg: 'bg-purple-100 dark:bg-purple-400/10', text: 'text-purple-500' },
  red: { bg: 'bg-red-100 dark:bg-red-400/10', text: 'text-red-500' },
};

@Component({
  selector: 'app-stats-widget',
  templateUrl: './stats-widget.html',
  imports: [CardModule],
})
export class StatsWidget {
  kpis: Kpi[] = [
    {
      key: 'inPeritaje',
      label: 'En peritaje',
      value: 8,
      icon: 'pi-wrench',
      color: 'orange',
    },
    {
      key: 'available',
      label: 'Disponibles',
      value: 23,
      icon: 'pi-check-circle',
      color: 'blue',
    },
    {
      key: 'reserved',
      label: 'Reservados',
      value: 4,
      icon: 'pi-bookmark',
      color: 'purple',
    },
    {
      key: 'soldThisMonth',
      label: 'Vendidos este mes',
      value: 12,
      icon: 'pi-dollar',
      color: 'green',
      trend: { direction: 'up', percentage: 15 },
    },
    {
      key: 'notApt',
      label: 'No aptos',
      value: 2,
      icon: 'pi-ban',
      color: 'red',
    },
  ];

  colorClasses = COLOR_CLASSES;
}
