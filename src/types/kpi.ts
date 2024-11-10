export interface KPI {
  id: string;
  name: string;
  category: 'production' | 'quality' | 'safety' | 'efficiency';
  target: number;
  actual: number;
  unit: string;
  trend: 'up' | 'down' | 'stable';
  status: 'on-track' | 'at-risk' | 'off-track';
  lastUpdated: string;
}