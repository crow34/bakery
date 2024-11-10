import React from 'react';
import { type App } from '../hooks/useApps';
import { BaggageClaim } from 'lucide-react';

interface StartMenuProps {
  isOpen: boolean;
  apps: App[];
  onAppClick: (id: string) => void;
  onClose: () => void;
}

export const StartMenu: React.FC<StartMenuProps> = ({ isOpen, apps, onAppClick, onClose }) => {
  if (!isOpen) return null;

  return (
    <div 
      className="fixed bottom-16 left-4 w-80 bg-white/90 backdrop-blur-lg rounded-lg shadow-xl border border-gray-200 p-4 z-50"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center space-x-3 mb-4 p-2 rounded-lg bg-orange-100">
        <BaggageClaim className="w-8 h-8 text-orange-600" />
        <span className="text-lg font-semibold text-orange-900">Warburtons OS</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        {apps.map((app) => {
          const Icon = app.icon;
          return (
            <button
              key={app.id}
              onClick={() => {
                onAppClick(app.id);
                onClose();
              }}
              className="flex flex-col items-center p-3 rounded-lg hover:bg-orange-50 transition-colors"
            >
              <Icon className="w-8 h-8 text-orange-600 mb-1" />
              <span className="text-sm text-gray-700 text-center">{app.title}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};