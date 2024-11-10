import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Save, X, LineChart } from 'lucide-react';
import { PrintButton } from '../components/PrintButton';

interface Transaction {
  id: string;
  date: string;
  category: 'revenue' | 'expense';
  type: string;
  amount: number;
  description: string;
}

const defaultTransactions: Transaction[] = [
  {
    id: '1',
    date: '2024-03-01',
    category: 'revenue',
    type: 'Sales',
    amount: 50000,
    description: 'Bread sales'
  },
  {
    id: '2',
    date: '2024-03-01',
    category: 'expense',
    type: 'Raw Materials',
    amount: 20000,
    description: 'Flour and ingredients'
  }
];

export const ProfitLoss: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('warburtons-transactions');
    return saved ? JSON.parse(saved) : defaultTransactions;
  });

  const [isAddingTransaction, setIsAddingTransaction] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [newTransaction, setNewTransaction] = useState<Omit<Transaction, 'id'>>({
    date: new Date().toISOString().split('T')[0],
    category: 'revenue',
    type: '',
    amount: 0,
    description: ''
  });

  useEffect(() => {
    localStorage.setItem('warburtons-transactions', JSON.stringify(transactions));
  }, [transactions]);

  const calculateTotals = () => {
    const revenue = transactions
      .filter(t => t.category === 'revenue')
      .reduce((sum, t) => sum + t.amount, 0);
    
    const expenses = transactions
      .filter(t => t.category === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);
    
    return {
      revenue,
      expenses,
      profit: revenue - expenses
    };
  };

  const handleAddTransaction = () => {
    const id = Math.random().toString(36).substr(2, 9);
    setTransactions([...transactions, { ...newTransaction, id }]);
    setIsAddingTransaction(false);
    setNewTransaction({
      date: new Date().toISOString().split('T')[0],
      category: 'revenue',
      type: '',
      amount: 0,
      description: ''
    });
  };

  const handleUpdateTransaction = () => {
    if (!editingTransaction) return;
    setTransactions(transactions.map(transaction => 
      transaction.id === editingTransaction.id ? editingTransaction : transaction
    ));
    setEditingTransaction(null);
  };

  const handleDeleteTransaction = (id: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      setTransactions(transactions.filter(transaction => transaction.id !== id));
    }
  };

  const handlePrint = () => {
    const printContent = document.getElementById('pl-content');
    if (printContent) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        const totals = calculateTotals();
        printWindow.document.write(`
          <html>
            <head>
              <title>Profit & Loss Report</title>
              <style>
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
                th { background-color: #f5f5f5; }
                .total { font-weight: bold; }
              </style>
            </head>
            <body>
              <h1>Profit & Loss Report</h1>
              <p>Generated: ${new Date().toLocaleString()}</p>
              <div class="totals">
                <p>Total Revenue: £${totals.revenue.toLocaleString()}</p>
                <p>Total Expenses: £${totals.expenses.toLocaleString()}</p>
                <p>Net Profit: £${totals.profit.toLocaleString()}</p>
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

  const totals = calculateTotals();

  return (
    <div className="h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-bold text-gray-900">Profit & Loss</h2>
          <PrintButton onPrint={handlePrint} />
        </div>
        <button
          onClick={() => setIsAddingTransaction(true)}
          className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors flex items-center"
        >
          <Plus className="w-5 h-5 mr-2" />
          Add Transaction
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-green-100 p-4 rounded-lg">
          <div className="text-sm text-green-600">Total Revenue</div>
          <div className="text-2xl font-bold text-green-800">£{totals.revenue.toLocaleString()}</div>
        </div>
        <div className="bg-red-100 p-4 rounded-lg">
          <div className="text-sm text-red-600">Total Expenses</div>
          <div className="text-2xl font-bold text-red-800">£{totals.expenses.toLocaleString()}</div>
        </div>
        <div className="bg-blue-100 p-4 rounded-lg">
          <div className="text-sm text-blue-600">Net Profit</div>
          <div className="text-2xl font-bold text-blue-800">£{totals.profit.toLocaleString()}</div>
        </div>
      </div>

      <div className="flex-1 overflow-auto" id="pl-content">
        <table className="min-w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    transaction.category === 'revenue' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {transaction.category}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.type}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  £{transaction.amount.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{transaction.description}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="p-1 text-blue-600 hover:text-blue-800"
                    >
                      <Edit2 className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteTransaction(transaction.id)}
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
      {(isAddingTransaction || editingTransaction) && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {isAddingTransaction ? 'Add New Transaction' : 'Edit Transaction'}
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Date</label>
                <input
                  type="date"
                  value={editingTransaction?.date || newTransaction.date}
                  onChange={e => editingTransaction
                    ? setEditingTransaction({ ...editingTransaction, date: e.target.value })
                    : setNewTransaction({ ...newTransaction, date: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <select
                  value={editingTransaction?.category || newTransaction.category}
                  onChange={e => editingTransaction
                    ? setEditingTransaction({ ...editingTransaction, category: e.target.value as 'revenue' | 'expense' })
                    : setNewTransaction({ ...newTransaction, category: e.target.value as 'revenue' | 'expense' })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                >
                  <option value="revenue">Revenue</option>
                  <option value="expense">Expense</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Type</label>
                <input
                  type="text"
                  value={editingTransaction?.type || newTransaction.type}
                  onChange={e => editingTransaction
                    ? setEditingTransaction({ ...editingTransaction, type: e.target.value })
                    : setNewTransaction({ ...newTransaction, type: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Amount</label>
                <input
                  type="number"
                  value={editingTransaction?.amount || newTransaction.amount}
                  onChange={e => editingTransaction
                    ? setEditingTransaction({ ...editingTransaction, amount: parseFloat(e.target.value) })
                    : setNewTransaction({ ...newTransaction, amount: parseFloat(e.target.value) })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <input
                  type="text"
                  value={editingTransaction?.description || newTransaction.description}
                  onChange={e => editingTransaction
                    ? setEditingTransaction({ ...editingTransaction, description: e.target.value })
                    : setNewTransaction({ ...newTransaction, description: e.target.value })
                  }
                  className="mt-1 w-full px-3 py-2 border rounded-lg"
                />
              </div>
            </div>
            <div className="flex justify-end space-x-2 mt-6">
              <button
                onClick={() => {
                  setIsAddingTransaction(false);
                  setEditingTransaction(null);
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={editingTransaction ? handleUpdateTransaction : handleAddTransaction}
                className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                {editingTransaction ? 'Update' : 'Add'} Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};