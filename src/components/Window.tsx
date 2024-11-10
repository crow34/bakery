import React, { useState } from 'react';
import { X, Minus, Maximize2 } from 'lucide-react';
import type { App } from '../hooks/useApps';

interface WindowProps {
  app: App;
  onClose: () => void;
  onMinimize: () => void;
}

export const Window: React.FC<WindowProps> = ({ app, onClose, onMinimize }) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const AppComponent = app.component;

  return (
    <div
      className={`absolute bg-white rounded-lg shadow-2xl overflow-hidden
        ${isMaximized ? 'inset-0 m-0' : 'w-3/4 h-3/4 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2'}`}
    >
      {/* Window Title Bar */}
      <div className="bg-orange-500 text-white p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <app.icon className="w-5 h-5" />
          <span className="font-medium">{app.title}</span>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={onMinimize}
            className="p-1 hover:bg-orange-400 rounded"
          >
            <Minus className="w-4 h-4" />
          </button>
          <button
            onClick={() => setIsMaximized(!isMaximized)}
            className="p-1 hover:bg-orange-400 rounded"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
          <button
            onClick={onClose}
            className="p-1 hover:bg-orange-400 rounded"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="p-4 h-[calc(100%-2.5rem)] overflow-auto">
        <AppComponent />
      </div>
    </div>
  );
};