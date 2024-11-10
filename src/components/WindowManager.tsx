import React from 'react';
import { type App } from '../hooks/useApps';
import { X, Minus } from 'lucide-react';

interface WindowManagerProps {
  apps: App[];
  onClose: (id: string) => void;
  onMinimize: (id: string) => void;
}

export const WindowManager: React.FC<WindowManagerProps> = ({ apps, onClose, onMinimize }) => {
  return (
    <div className="fixed inset-0 p-4 pt-2 pb-20 pointer-events-none">
      {apps.map((app) => app.isOpen && !app.isMinimized && (
        <div
          key={app.id}
          className="absolute inset-4 bg-white rounded-lg shadow-xl pointer-events-auto flex flex-col"
          style={{ bottom: '5rem' }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <app.icon className="w-5 h-5 text-orange-600" />
              <h2 className="text-lg font-semibold text-gray-900">{app.title}</h2>
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => onMinimize(app.id)}
                className="p-1 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-5 h-5 text-gray-600" />
              </button>
              <button
                onClick={() => onClose(app.id)}
                className="p-1 rounded-lg hover:bg-red-100 transition-colors"
              >
                <X className="w-5 h-5 text-red-600" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-auto">
            <app.component />
          </div>
        </div>
      ))}
    </div>
  );
};