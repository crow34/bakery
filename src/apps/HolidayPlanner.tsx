import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Calendar } from 'lucide-react';
import { PrintButton } from '../components/PrintButton';

interface Holiday {
  id: string;
  employeeName: string;
  department: string;
  startDate: string;
  endDate: string;
  type: 'annual' | 'sick' | 'personal' | 'other';
  status: 'pending' | 'approved' | 'rejected';
  notes: string;
}

const defaultHolidays: Holiday[] = [
  {
    id: '1',
    employeeName: 'John Smith',
    department: 'Production',
    startDate: '2024-03-15',
    endDate: '2024-03-22',
    type: 'annual',
    status: 'approved',
    notes: 'Family vacation'
  },
  {
    id: '2',
    employeeName: 'Sarah Johnson',
    department: 'Engineering',
    startDate: '2024-04-01',
    endDate: '2024-04-05',
    type: 'personal',
    status: 'pending',
    notes: 'Personal appointment'
  }
];

export const HolidayPlanner: React.FC = () => {
  const [holidays, setHolidays] = useState<Holiday[]>(() => {
    const saved = localStorage.getItem('warburtons-holidays');
    return saved ? JSON.parse(saved) : defaultHolidays;
  });
  
  const [isAddingHoliday, setIsAddingHoliday] = useState(false);
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  const [newHoliday, setNewHoliday] = useState<Omit<Holiday, 'id'>>({
    employeeName: '',
    department: '',
    startDate: '',
    endDate: '',
    type: 'annual',
    status: 'pending',
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('warburtons-holidays', JSON.stringify(holidays));
  }, [holidays]);

  const handleAddHoliday = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setHolidays([...holidays, { ...newHoliday, id }]);
    setIsAddingHoliday(false);
    setNewHoliday({
      employeeName: '',
      department: '',
      startDate: '',
      endDate: '',
      type: 'annual',
      status: 'pending',
      notes: ''
    });
  };

  const handleUpdateHoliday = () => {
    if (!editingHoliday) return;
    setHolidays(holidays.map(holiday => 
      holiday.id === editingHoliday.id ? editingHoliday : holiday
    ));
    setEditingHoliday(null);
  };

  const handleDeleteHoliday = (id: string) => {
    if (window.confirm('Are you sure you want to delete this holiday request?')) {
      setHolidays(holidays.filter(holiday => holiday.id !== id));
    }
  };

  const getStatusColor = (status: Holiday['status']) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('holiday-planner-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Holiday Planner Report</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .status { padding: 4px 8px; border-radius: 9999px; }
                .approved { background-color: #dcfce7; color: #166534; }
                .pending { background-color: #fef9c3; color: #854d0e; }
                .rejected { background-color: #fee2e2; color: #991b1b; }
              </style>
            </head>
            <body>
              <h1>Holiday Planner Report</h1>
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
          <h2 className="text-2xl font-bold text-gray-900">Holiday Planner</h2>
          <PrintButton onPrint={handlePrint} />
        </div>
        <button
          onClick={() => setIsAddingHoliday(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Request
        </button>
      </div>

      <div className="flex-1 overflow-auto" id="holiday-planner-content">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Employee</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Range</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {holidays.map(holiday => (
              <tr key={holiday.id}>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.employeeName}</td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.department}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(holiday.startDate).toLocaleDateString()} - {new Date(holiday.endDate).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(holiday.status)}`}>
                    {holiday.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{holiday.notes}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingHoliday(holiday)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteHoliday(holiday.id)}
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

      {/* Add/Edit Modal */}
      {(isAddingHoliday || editingHoliday) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingHoliday ? 'New Holiday Request' : 'Edit Holiday Request'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Employee Name</label>
                <input
                  type="text"
                  value={editingHoliday?.employeeName || newHoliday.employeeName}
                  onChange={e => editingHoliday
                    ? setEditingHoliday({ ...editingHoliday, employeeName: e.target.value })
                    : setNewHoliday({ ...newHoliday, employeeName: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Department</label>
                <input
                  type="text"
                  value={editingHoliday?.department || newHoliday.department}
                  onChange={e => editingHoliday
                    ? setEditingHoliday({ ...editingHoliday, department: e.target.value })
                    : setNewHoliday({ ...newHoliday, department: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Start Date</label>
                <input
                  type="date"
                  value={editingHoliday?.startDate || newHoliday.startDate}
                  onChange={e => editingHoliday
                    ? setEditingHoliday({ ...editingHoliday, startDate: e.target.value })
                    : setNewHoliday({ ...newHoliday, startDate: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">End Date</label>
                <input
                  type="date"
                  value={editingHoliday?.endDate || newHoliday.endDate}
                  onChange={e => editingHoliday
                    ? setEditingHoliday({ ...editingHoliday, endDate: e.target.value })
                    : setNewHoliday({ ...newHoliday, endDate: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <select
                  value={editingHoliday?.type || newHoliday.type}
                  onChange={e => editingHoliday
                    ? setEditingHoliday({ ...editingHoliday, type: e.target.value as Holiday['type'] })
                    : setNewHoliday({ ...newHoliday, type: e.target.value as Holiday['type'] })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                >
                  <option value="annual">Annual</option>
                  <option value="sick">Sick</option>
                  <option value="personal">Personal</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingHoliday?.status || newHoliday.status}
                  onChange={e => editingHoliday
                    ? setEditingHoliday({ ...editingHoliday, status: e.target.value as Holiday['status'] })
                    : setNewHoliday({ ...newHoliday, status: e.target.value as Holiday['status'] })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <input
                  type="text"
                  value={editingHoliday?.notes || newHoliday.notes}
                  onChange={e => editingHoliday
                    ? setEditingHoliday({ ...editingHoliday, notes: e.target.value })
                    : setNewHoliday({ ...newHoliday, notes: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setIsAddingHoliday(false);
                  setEditingHoliday(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={editingHoliday ? handleUpdateHoliday : handleAddHoliday}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {editingHoliday ? 'Update' : 'Add'} Holiday
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};