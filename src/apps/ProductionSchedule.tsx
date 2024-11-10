import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { PrintButton } from '../components/PrintButton';

interface ProductionLine {
  id: string;
  name: string;
  status: 'running' | 'stopped' | 'maintenance';
  product: string;
  target: number;
  actual: number;
  shift: string;
  startTime: string;
  endTime: string;
}

const defaultLines: ProductionLine[] = [
  {
    id: '1',
    name: 'BP1',
    status: 'running',
    product: 'White Bread',
    target: 1000,
    actual: 850,
    shift: 'Morning',
    startTime: '06:00',
    endTime: '14:00'
  },
  {
    id: '2',
    name: 'BP2',
    status: 'maintenance',
    product: 'Wholemeal Bread',
    target: 800,
    actual: 600,
    shift: 'Morning',
    startTime: '06:00',
    endTime: '14:00'
  }
];

export const ProductionSchedule: React.FC = () => {
  const [lines, setLines] = useState<ProductionLine[]>(() => {
    const saved = localStorage.getItem('warburtons-production-lines');
    return saved ? JSON.parse(saved) : defaultLines;
  });
  
  const [editingLine, setEditingLine] = useState<ProductionLine | null>(null);
  const [isAddingLine, setIsAddingLine] = useState(false);
  const [newLine, setNewLine] = useState<Omit<ProductionLine, 'id'>>({
    name: '',
    status: 'stopped',
    product: '',
    target: 0,
    actual: 0,
    shift: '',
    startTime: '',
    endTime: ''
  });

  useEffect(() => {
    localStorage.setItem('warburtons-production-lines', JSON.stringify(lines));
  }, [lines]);

  const handleAddLine = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setLines([...lines, { ...newLine, id }]);
    setIsAddingLine(false);
    setNewLine({
      name: '',
      status: 'stopped',
      product: '',
      target: 0,
      actual: 0,
      shift: '',
      startTime: '',
      endTime: ''
    });
  };

  const handleUpdateLine = () => {
    if (!editingLine) return;
    setLines(lines.map(line => 
      line.id === editingLine.id ? editingLine : line
    ));
    setEditingLine(null);
  };

  const handleDeleteLine = (id: string) => {
    if (window.confirm('Are you sure you want to delete this production line?')) {
      setLines(lines.filter(line => line.id !== id));
    }
  };

  const getStatusColor = (status: ProductionLine['status']) => {
    switch (status) {
      case 'running':
        return 'bg-green-100 text-green-800';
      case 'stopped':
        return 'bg-red-100 text-red-800';
      case 'maintenance':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('production-schedule-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Production Schedule Report</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .status { padding: 4px 8px; border-radius: 9999px; }
                .running { background-color: #dcfce7; color: #166534; }
                .stopped { background-color: #fee2e2; color: #991b1b; }
                .maintenance { background-color: #fef9c3; color: #854d0e; }
              </style>
            </head>
            <body>
              <h1>Production Schedule Report</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              ${printContent.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Production Schedule</h2>
          <PrintButton onPrint={handlePrint} />
        </div>
        <button
          onClick={() => setIsAddingLine(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Line
        </button>
      </div>

      <div className="flex-1 overflow-auto" id="production-schedule-content">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Line</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shift</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {lines.map(line => (
              <tr key={line.id}>
                <td className="px-6 py-4 whitespace-nowrap">{line.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(line.status)}`}>
                    {line.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{line.product}</td>
                <td className="px-6 py-4 whitespace-nowrap">{line.target}</td>
                <td className="px-6 py-4 whitespace-nowrap">{line.actual}</td>
                <td className="px-6 py-4 whitespace-nowrap">{line.shift}</td>
                <td className="px-6 py-4 whitespace-nowrap">{line.startTime} - {line.endTime}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingLine(line)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteLine(line.id)}
                      className="p-1 text-red-600 hover:text-red-800"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {(isAddingLine || editingLine) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingLine ? 'Add New Line' : 'Edit Line'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Line Name</label>
                <input
                  type="text"
                  value={editingLine?.name || newLine.name}
                  onChange={e => editingLine
                    ? setEditingLine({ ...editingLine, name: e.target.value })
                    : setNewLine({ ...newLine, name: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingLine?.status || newLine.status}
                  onChange={e => editingLine
                    ? setEditingLine({ ...editingLine, status: e.target.value as ProductionLine['status'] })
                    : setNewLine({ ...newLine, status: e.target.value as ProductionLine['status'] })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                >
                  <option value="running">Running</option>
                  <option value="stopped">Stopped</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Product</label>
                <input
                  type="text"
                  value={editingLine?.product || newLine.product}
                  onChange={e => editingLine
                    ? setEditingLine({ ...editingLine, product: e.target.value })
                    : setNewLine({ ...newLine, product: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Target</label>
                <input
                  type="number"
                  value={editingLine?.target || newLine.target}
                  onChange={e => editingLine
                    ? setEditingLine({ ...editingLine, target: parseInt(e.target.value) })
                    : setNewLine({ ...newLine, target: parseInt(e.target.value) })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Actual</label>
                <input
                  type="number"
                  value={editingLine?.actual || newLine.actual}
                  onChange={e => editingLine
                    ? setEditingLine({ ...editingLine, actual: parseInt(e.target.value) })
                    : setNewLine({ ...newLine, actual: parseInt(e.target.value) })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Shift</label>
                <input
                  type="text"
                  value={editingLine?.shift || newLine.shift}
                  onChange={e => editingLine
                    ? setEditingLine({ ...editingLine, shift: e.target.value })
                    : setNewLine({ ...newLine, shift: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Time</label>
                <input
                  type="time"
                  value={editingLine?.startTime || newLine.startTime}
                  onChange={e => editingLine
                    ? setEditingLine({ ...editingLine, startTime: e.target.value })
                    : setNewLine({ ...newLine, startTime: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Time</label>
                <input
                  type="time"
                  value={editingLine?.endTime || newLine.endTime}
                  onChange={e => editingLine
                    ? setEditingLine({ ...editingLine, endTime: e.target.value })
                    : setNewLine({ ...newLine, endTime: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setIsAddingLine(false);
                  setEditingLine(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={editingLine ? handleUpdateLine : handleAddLine}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {editingLine ? 'Update' : 'Add'} Line
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};