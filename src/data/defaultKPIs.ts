import { type KPI } from '../types/kpi';

export const defaultKPIs: KPI[] = [
  {
    id: '1',
    name: 'Production Output',
    category: 'production',
    target: 10000,
    actual: 9800,
    unit: 'units',
    trend: 'up',
    status: 'on-track',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '2',
    name: 'Quality Score',
    category: 'quality',
    target: 98,
    actual: 97.5,
    unit: '%',
    trend: 'stable',
    status: 'on-track',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '3',
    name: 'Safety Incidents',
    category: 'safety',
    target: 0,
    actual: 1,
    unit: 'incidents',
    trend: 'up',
    status: 'off-track',
    lastUpdated: new Date().toISOString()
  },
  {
    id: '4',
    name: 'OEE',
    category: 'efficiency',
    target: 85,
    actual: 82,
    unit: '%',
    trend: 'down',
    status: 'at-risk',
    lastUpdated: new Date().toISOString()
  }
];