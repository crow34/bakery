import React from 'react';
import { Menu } from 'lucide-react';
import type { App } from '../hooks/useApps';

interface TaskbarProps {
  apps: App[];
  isStartMenuOpen: boolean;
  onStartMenuToggle: () => void;
  onAppClick: (id: string) => void;
}

export const Taskbar: React.FC<TaskbarProps> = ({
  apps,
  isStartMenuOpen,
  onStartMenuToggle,
  onAppClick,
}) => {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/80 backdrop-blur-lg flex items-center px-4 space-x-2">
      <button
        onClick={onStartMenuToggle}
        className={`p-2 rounded-lg transition-colors ${
          isStartMenuOpen ? 'bg-orange-500 text-white' : 'text-white hover:bg-white/10'
        }`}
      >
        <Menu className="w-6 h-6" />
      </button>

      <div className="h-full w-px bg-white/10" />

      {apps.map((app) => (
        <button
          key={app.id}
          onClick={() => onAppClick(app.id)}
          className="flex items-center space-x-2 px-3 py-1 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
        >
          <app.icon className="w-5 h-5 text-white" />
          <span className="text-white text-sm font-medium">{app.title}</span>
        </button>
      ))}
    </div>
  );
};