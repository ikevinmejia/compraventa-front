export interface KpiTrend {
  direction: 'up' | 'down';
  percentage: number;
}

export interface Kpi {
  key: string;
  label: string;
  value: number;
  icon: string;
  color: 'blue' | 'green' | 'orange' | 'purple' | 'red';
  trend?: KpiTrend;
}

export interface DashboardData {
  kpis: Kpi[];
  // más adelante: salesTrend, topBrands, staleInventory, etc.
}
