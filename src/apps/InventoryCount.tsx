import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, PackageSearch } from 'lucide-react';
import { PrintButton } from '../components/PrintButton';

interface InventoryItem {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minStock: number;
  location: string;
  lastCount: string;
  notes: string;
}

const defaultItems: InventoryItem[] = [
  {
    id: '1',
    sku: 'FL001',
    name: 'Strong White Flour',
    category: 'Raw Materials',
    quantity: 2500,
    unit: 'kg',
    minStock: 1000,
    location: 'Warehouse A',
    lastCount: new Date().toISOString(),
    notes: 'Main bread flour'
  },
  {
    id: '2',
    sku: 'YE001',
    name: 'Active Dry Yeast',
    category: 'Raw Materials',
    quantity: 100,
    unit: 'kg',
    minStock: 50,
    location: 'Cold Storage B',
    lastCount: new Date().toISOString(),
    notes: 'Keep refrigerated'
  }
];

export const InventoryCount: React.FC = () => {
  const [items, setItems] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem('warburtons-inventory');
    return saved ? JSON.parse(saved) : defaultItems;
  });

  const [isAddingItem, setIsAddingItem] = useState(false);
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newItem, setNewItem] = useState<Omit<InventoryItem, 'id'>>({
    sku: '',
    name: '',
    category: '',
    quantity: 0,
    unit: '',
    minStock: 0,
    location: '',
    lastCount: new Date().toISOString(),
    notes: ''
  });

  useEffect(() => {
    localStorage.setItem('warburtons-inventory', JSON.stringify(items));
  }, [items]);

  const handleAddItem = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setItems([...items, { ...newItem, id }]);
    setIsAddingItem(false);
    setNewItem({
      sku: '',
      name: '',
      category: '',
      quantity: 0,
      unit: '',
      minStock: 0,
      location: '',
      lastCount: new Date().toISOString(),
      notes: ''
    });
  };

  const handleUpdateItem = () => {
    if (!editingItem) return;
    setItems(items.map(item => 
      item.id === editingItem.id ? editingItem : item
    ));
    setEditingItem(null);
  };

  const handleDeleteItem = (id: string) => {
    if (window.confirm('Are you sure you want to delete this inventory item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('inventory-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Inventory Count Report</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
              </style>
            </head>
            <body>
              <h1>Inventory Count Report</h1>
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
          <h2 className="text-2xl font-bold text-gray-900">Inventory Count</h2>
          <PrintButton onPrint={handlePrint} />
        </div>
        <button
          onClick={() => setIsAddingItem(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Item
        </button>
      </div>

      <div className="flex-1 overflow-auto" id="inventory-content">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Min Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Count</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map(item => (
              <tr key={item.id} className={item.quantity <= item.minStock ? 'bg-red-50' : ''}>
                <td className="px-6 py-4 whitespace-nowrap">{item.sku}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{item.category}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.quantity} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {item.minStock} {item.unit}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{item.location}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(item.lastCount).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
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
      {(isAddingItem || editingItem) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingItem ? 'Add New Item' : 'Edit Item'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">SKU</label>
                <input
                  type="text"
                  value={editingItem?.sku || newItem.sku}
                  onChange={e => editingItem 
                    ? setEditingItem({ ...editingItem, sku: e.target.value })
                    : setNewItem({ ...newItem, sku: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={editingItem?.name || newItem.name}
                  onChange={e => editingItem
                    ? setEditingItem({ ...editingItem, name: e.target.value })
                    : setNewItem({ ...newItem, name: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              {/* Add more fields as needed */}
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setIsAddingItem(false);
                  setEditingItem(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={editingItem ? handleUpdateItem : handleAddItem}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {editingItem ? 'Update' : 'Add'} Item
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};