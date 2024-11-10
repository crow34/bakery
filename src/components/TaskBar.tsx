import React from 'react';
import { BaggageClaim } from 'lucide-react';
import { type App } from '../hooks/useApps';
import { Clock } from './Clock';

interface TaskBarProps {
  onStartClick: () => void;
  openApps: App[];
  onAppClick: (id: string) => void;
  isStartMenuOpen: boolean;
}

export const TaskBar: React.FC<TaskBarProps> = ({ onStartClick, openApps, onAppClick, isStartMenuOpen }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 h-16 bg-white/90 backdrop-blur-lg border-t border-gray-200 px-4 flex items-center justify-between z-40">
      <div className="flex items-center space-x-2">
        <button
          onClick={onStartClick}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg hover:bg-orange-50 transition-colors"
        >
          <BaggageClaim className="w-6 h-6 text-orange-600" />
          <span className="text-gray-700">Start</span>
        </button>

        <div className="h-8 w-px bg-gray-200 mx-2" />

        <div className="flex space-x-1">
          {openApps.map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={() => onAppClick(app.id)}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-orange-50 transition-colors"
              >
                <Icon className="w-5 h-5 text-orange-600" />
                <span className="text-sm text-gray-700">{app.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      <Clock />
    </div>
  );
};