import React from 'react';
import { Printer } from 'lucide-react';

interface PrintButtonProps {
  onPrint: () => void;
}

export const PrintButton: React.FC<PrintButtonProps> = ({ onPrint }) => {
  return (
    <button
      onClick={onPrint}
      className="flex items-center px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
    >
      <Printer className="w-4 h-4 mr-2" />
      Print
    </button>
  );
};