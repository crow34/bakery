import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { KPICard } from '../components/kpi/KPICard';
import { defaultKPIs } from '../data/defaultKPIs';
import { type KPI } from '../types/kpi';

export const KPIDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPI[]>(() => {
    const saved = localStorage.getItem('warburtons-kpis');
    return saved ? JSON.parse(saved) : defaultKPIs;
  });

  useEffect(() => {
    localStorage.setItem('warburtons-kpis', JSON.stringify(kpis));
  }, [kpis]);

  return (
    <div className="h-full flex flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900">KPI Dashboard</h2>
        <div className="flex space-x-4">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-green-600" />
            <span className="text-sm text-gray-600">
              {kpis.filter(kpi => kpi.status === 'on-track').length} On Track
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <span className="text-sm text-gray-600">
              {kpis.filter(kpi => kpi.status === 'off-track').length} Off Track
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {kpis.map(kpi => (
          <KPICard key={kpi.id} kpi={kpi} />
        ))}
      </div>
    </div>
  );
};