import React, { useState } from 'react';
import { LoginScreen } from './components/LoginScreen';
import { WindowManager } from './components/WindowManager';
import { TaskBar } from './components/TaskBar';
import { StartMenu } from './components/StartMenu';
import { useApps } from './hooks/useApps';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    const user = localStorage.getItem('warburtons-user');
    return !!user;
  });
  const [isStartMenuOpen, setIsStartMenuOpen] = useState(false);
  const { apps, openApp, closeApp, minimizeApp } = useApps();

  const handleStartClick = () => {
    setIsStartMenuOpen(!isStartMenuOpen);
  };

  const handleAppClick = (id: string) => {
    openApp(id);
    setIsStartMenuOpen(false);
  };

  const handleBackgroundClick = () => {
    if (isStartMenuOpen) {
      setIsStartMenuOpen(false);
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <div 
      className="min-h-screen bg-[url('https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&q=80&w=1920')] bg-cover bg-center"
      onClick={handleBackgroundClick}
    >
      <div className="absolute inset-0 bg-black/10" />
      
      <WindowManager 
        apps={apps}
        onClose={closeApp}
        onMinimize={minimizeApp}
      />

      <StartMenu
        isOpen={isStartMenuOpen}
        apps={apps}
        onAppClick={handleAppClick}
        onClose={() => setIsStartMenuOpen(false)}
      />

      <TaskBar
        onStartClick={handleStartClick}
        openApps={apps.filter(app => app.isOpen)}
        onAppClick={handleAppClick}
        isStartMenuOpen={isStartMenuOpen}
      />
    </div>
  );
}

export default App;