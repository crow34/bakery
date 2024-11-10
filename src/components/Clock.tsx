import React, { useState, useEffect } from 'react';
import { Clock as ClockIcon } from 'lucide-react';

export const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-gray-600">
      <ClockIcon className="w-4 h-4" />
      <span className="text-sm font-medium">
        {time.toLocaleTimeString()}
      </span>
    </div>
  );
};