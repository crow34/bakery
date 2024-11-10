import React from 'react';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';
import { type KPI } from '../../types/kpi';

interface KPICardProps {
  kpi: KPI;
}

export const KPICard: React.FC<KPICardProps> = ({ kpi }) => {
  const getStatusColor = (status: KPI['status']) => {
    switch (status) {
      case 'on-track':
        return 'bg-green-100 text-green-800';
      case 'at-risk':
        return 'bg-yellow-100 text-yellow-800';
      case 'off-track':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrendIcon = (trend: KPI['trend']) => {
    switch (trend) {
      case 'up':
        return <TrendingUp className="w-5 h-5 text-green-600" />;
      case 'down':
        return <TrendingDown className="w-5 h-5 text-red-600" />;
      default:
        return <BarChart3 className="w-5 h-5 text-gray-600" />;
    }
  };

  const getCategoryColor = (category: KPI['category']) => {
    switch (category) {
      case 'production':
        return 'bg-blue-100 text-blue-800';
      case 'quality':
        return 'bg-purple-100 text-purple-800';
      case 'safety':
        return 'bg-orange-100 text-orange-800';
      case 'efficiency':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const calculateProgress = (actual: number, target: number) => {
    return Math.min(Math.max((actual / target) * 100, 0), 100);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{kpi.name}</h3>
          <span className={`inline-block px-2 py-1 text-xs rounded-full mt-1 ${getCategoryColor(kpi.category)}`}>
            {kpi.category}
          </span>
        </div>
        <div className="flex items-center space-x-2">
          {getTrendIcon(kpi.trend)}
          <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(kpi.status)}`}>
            {kpi.status}
          </span>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm text-gray-600 mb-1">
            <span>Progress</span>
            <span>{kpi.actual} / {kpi.target} {kpi.unit}</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full bg-orange-500 rounded-full transition-all duration-500"
              style={{ width: `${calculateProgress(kpi.actual, kpi.target)}%` }}
            />
          </div>
        </div>

        <div className="text-xs text-gray-500">
          Last updated: {new Date(kpi.lastUpdated).toLocaleString()}
        </div>
      </div>
    </div>
  );
};