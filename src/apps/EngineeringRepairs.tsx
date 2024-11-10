import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, Tool, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { PrintButton } from '../components/PrintButton';

interface Repair {
  id: string;
  equipment: string;
  issue: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in-progress' | 'completed';
  assignedTo: string;
  reportedBy: string;
  reportedDate: string;
  completedDate?: string;
  notes: string;
  parts: string[];
}

const defaultRepairs: Repair[] = [
  {
    id: '1',
    equipment: 'BP1 Mixer',
    issue: 'Unusual noise from main bearing',
    priority: 'high',
    status: 'in-progress',
    assignedTo: 'Mike Thompson',
    reportedBy: 'John Smith',
    reportedDate: '2024-03-10T08:30:00',
    notes: 'Bearing replacement required',
    parts: ['Main Bearing Assembly', 'Seal Kit']
  },
  {
    id: '2',
    equipment: 'MG1 Conveyor',
    issue: 'Belt misalignment',
    priority: 'medium',
    status: 'pending',
    assignedTo: 'Sarah Wilson',
    reportedBy: 'David Brown',
    reportedDate: '2024-03-11T09:15:00',
    notes: 'Belt needs adjustment and tensioning',
    parts: ['Tensioner Spring']
  }
];

export const EngineeringRepairs: React.FC = () => {
  const [repairs, setRepairs] = useState<Repair[]>(() => {
    const saved = localStorage.getItem('warburtons-repairs');
    return saved ? JSON.parse(saved) : defaultRepairs;
  });

  const [isAddingRepair, setIsAddingRepair] = useState(false);
  const [editingRepair, setEditingRepair] = useState<Repair | null>(null);
  const [newRepair, setNewRepair] = useState<Omit<Repair, 'id'>>({
    equipment: '',
    issue: '',
    priority: 'medium',
    status: 'pending',
    assignedTo: '',
    reportedBy: '',
    reportedDate: new Date().toISOString(),
    notes: '',
    parts: []
  });

  useEffect(() => {
    localStorage.setItem('warburtons-repairs', JSON.stringify(repairs));
  }, [repairs]);

  const handleAddRepair = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setRepairs([...repairs, { ...newRepair, id }]);
    setIsAddingRepair(false);
    setNewRepair({
      equipment: '',
      issue: '',
      priority: 'medium',
      status: 'pending',
      assignedTo: '',
      reportedBy: '',
      reportedDate: new Date().toISOString(),
      notes: '',
      parts: []
    });
  };

  const handleUpdateRepair = () => {
    if (!editingRepair) return;
    setRepairs(repairs.map(repair => 
      repair.id === editingRepair.id ? editingRepair : repair
    ));
    setEditingRepair(null);
  };

  const handleDeleteRepair = (id: string) => {
    if (window.confirm('Are you sure you want to delete this repair record?')) {
      setRepairs(repairs.filter(repair => repair.id !== id));
    }
  };

  const getPriorityColor = (priority: Repair['priority']) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'high':
        return 'bg-orange-100 text-orange-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: Repair['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('engineering-repairs-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Engineering Repairs Report</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .status { padding: 4px 8px; border-radius: 9999px; }
                .critical { background-color: #fee2e2; color: #991b1b; }
                .high { background-color: #ffedd5; color: #9a3412; }
                .medium { background-color: #fef9c3; color: #854d0e; }
                .low { background-color: #dcfce7; color: #166534; }
                .completed { background-color: #dcfce7; color: #166534; }
                .in-progress { background-color: #dbeafe; color: #1e40af; }
                .pending { background-color: #fef9c3; color: #854d0e; }
              </style>
            </head>
            <body>
              <h1>Engineering Repairs Report</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <div class="summary">
                <h2>Summary</h2>
                <p>Critical Issues: ${repairs.filter(r => r.priority === 'critical' && r.status !== 'completed').length}</p>
                <p>Completed Repairs: ${repairs.filter(r => r.status === 'completed').length}</p>
              </div>
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
          <h2 className="text-2xl font-bold text-gray-900">Engineering Repairs</h2>
          <PrintButton onPrint={handlePrint} />
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-sm flex items-center ${getPriorityColor('critical')}`}>
              <AlertTriangle className="w-4 h-4 mr-1" />
              {repairs.filter(r => r.priority === 'critical' && r.status !== 'completed').length} Critical
            </span>
            <span className={`px-3 py-1 rounded-full text-sm flex items-center ${getStatusColor('completed')}`}>
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {repairs.filter(r => r.status === 'completed').length} Completed
            </span>
          </div>
        </div>
        <button
          onClick={() => setIsAddingRepair(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          New Repair
        </button>
      </div>

      <div className="flex-1 overflow-auto" id="engineering-repairs-content">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Priority</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reported</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parts</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {repairs.map(repair => (
              <tr key={repair.id}>
                <td className="px-6 py-4 whitespace-nowrap">{repair.equipment}</td>
                <td className="px-6 py-4 whitespace-nowrap">{repair.issue}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getPriorityColor(repair.priority)}`}>
                    {repair.priority}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(repair.status)}`}>
                    {repair.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{repair.assignedTo}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm">
                    <div>{new Date(repair.reportedDate).toLocaleDateString()}</div>
                    <div className="text-gray-500">{repair.reportedBy}</div>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {repair.parts.map((part, index) => (
                      <span key={index} className="px-2 py-1 text-xs bg-gray-100 rounded-full">
                        {part}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingRepair(repair)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteRepair(repair.id)}
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
      {(isAddingRepair || editingRepair) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingRepair ? 'New Repair Request' : 'Edit Repair Request'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Equipment</label>
                <input
                  type="text"
                  value={editingRepair?.equipment || newRepair.equipment}
                  onChange={e => editingRepair
                    ? setEditingRepair({ ...editingRepair, equipment: e.target.value })
                    : setNewRepair({ ...newRepair, equipment: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Issue</label>
                <input
                  type="text"
                  value={editingRepair?.issue || newRepair.issue}
                  onChange={e => editingRepair
                    ? setEditingRepair({ ...editingRepair, issue: e.target.value })
                    : setNewRepair({ ...newRepair, issue: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={editingRepair?.priority || newRepair.priority}
                  onChange={e => editingRepair
                    ? setEditingRepair({ ...editingRepair, priority: e.target.value as Repair['priority'] })
                    : setNewRepair({ ...newRepair, priority: e.target.value as Repair['priority'] })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Status</label>
                <select
                  value={editingRepair?.status || newRepair.status}
                  onChange={e => editingRepair
                    ? setEditingRepair({ ...editingRepair, status: e.target.value as Repair['status'] })
                    : setNewRepair({ ...newRepair, status: e.target.value as Repair['status'] })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Assigned To</label>
                <input
                  type="text"
                  value={editingRepair?.assignedTo || newRepair.assignedTo}
                  onChange={e => editingRepair
                    ? setEditingRepair({ ...editingRepair, assignedTo: e.target.value })
                    : setNewRepair({ ...newRepair, assignedTo: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Reported By</label>
                <input
                  type="text"
                  value={editingRepair?.reportedBy || newRepair.reportedBy}
                  onChange={e => editingRepair
                    ? setEditingRepair({ ...editingRepair, reportedBy: e.target.value })
                    : setNewRepair({ ...newRepair, reportedBy: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Notes</label>
                <textarea
                  value={editingRepair?.notes || newRepair.notes}
                  onChange={e => editingRepair
                    ? setEditingRepair({ ...editingRepair, notes: e.target.value })
                    : setNewRepair({ ...newRepair, notes: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                  rows={3}
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Parts Required</label>
                <input
                  type="text"
                  placeholder="Enter parts separated by commas"
                  value={editingRepair ? editingRepair.parts.join(', ') : newRepair.parts.join(', ')}
                  onChange={e => {
                    const parts = e.target.value.split(',').map(p => p.trim()).filter(Boolean);
                    editingRepair
                      ? setEditingRepair({ ...editingRepair, parts })
                      : setNewRepair({ ...newRepair, parts });
                  }}
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setIsAddingRepair(false);
                  setEditingRepair(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={editingRepair ? handleUpdateRepair : handleAddRepair}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {editingRepair ? 'Update' : 'Add'} Repair
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};