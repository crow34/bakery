import React, { useState } from 'react';
import { StartMenu } from './StartMenu';
import { Taskbar } from './Taskbar';
import { Window } from './Window';
import { useApps } from '../hooks/useApps';

interface DesktopProps {
  onLogout: () => void;
}

export const Desktop: React.FC<DesktopProps> = ({ onLogout }) => {
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const { apps, openApps, toggleApp, minimizeApp, closeApp } = useApps();

  return (
    <div 
      className="h-screen w-screen bg-orange-100 overflow-hidden relative"
      style={{
        backgroundImage: 'url("https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1920")',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-black/10" />
      
      {/* Desktop Icons */}
      <div className="grid grid-cols-auto-fit gap-4 p-4">
        {apps.map((app) => (
          <button
            key={app.id}
            onClick={() => toggleApp(app.id)}
            className="flex flex-col items-center p-2 rounded-lg hover:bg-white/10 transition-colors group"
          >
            <app.icon className="w-12 h-12 text-white drop-shadow-md group-hover:scale-110 transition-transform" />
            <span className="mt-2 text-sm text-white font-medium drop-shadow-md">
              {app.title}
            </span>
          </button>
        ))}
      </div>

      {/* Windows */}
      {openApps.map((app) => (
        <Window
          key={app.id}
          app={app}
          onClose={() => closeApp(app.id)}
          onMinimize={() => minimizeApp(app.id)}
        />
      ))}

      {/* Start Menu */}
      {isStartMenuOpen && (
        <StartMenu apps={apps} onAppClick={toggleApp} onLogout={onLogout} />
      )}

      {/* Taskbar */}
      <Taskbar
        apps={openApps}
        isStartMenuOpen={isStartMenuOpen}
        onStartMenuToggle={() => setIsStartMenuOpen(!isStartMenuOpen)}
        onAppClick={toggleApp}
      />
    </div>
  );
};