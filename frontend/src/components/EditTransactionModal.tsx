import React, { useState, useEffect } from 'react';
import { X, Save, MessageSquare, Tag, Calendar } from 'lucide-react';
import { apiClient } from '../services/api';
import toast from 'react-hot-toast';

interface Transaction {
  id: number;
  name: string;
  email: string;
  type: string;
  category: string;
  amount: number;
  date: string;
  time: string;
  status: string;
  reference: string;
  description: string;
}

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onSave: (updatedTransaction: Transaction) => void;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction, 
  onSave 
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: '',
    tags: '',
    status: ''
  });

  const categories = [
    'Revenue',
    'Expense',
  ];

  useEffect(() => {
    if (transaction) {
      setFormData({
        amount: Math.abs(transaction.amount).toString(),
        category: transaction.category,
        description: transaction.description,
        date: transaction.date ? transaction.date.split('T')[0] : '',
        tags: '',
        status: transaction.status,
      });
    }
  }, [transaction]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (transaction) {
      try {
        const updatedFields = {
          amount: formData.amount ? parseFloat(formData.amount) : 0,
          category: formData.category as 'Revenue' | 'Expense',
          description: formData.description,
          date: formData.date,
          status: formData.status as 'Paid' | 'Pending',
        };
        await apiClient.updateTransaction(transaction.id, updatedFields);
        toast.success('Transaction updated successfully');
        onSave({ ...transaction, ...updatedFields });
        onClose();
      } catch (error: any) {
        toast.error(error.message || 'Failed to update transaction');
      }
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Edit Transaction</h2>
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Close"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {/* Transaction Info */}
          <div className="bg-gray-700/30 rounded-lg p-4">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-medium">
                  {transaction.name.charAt(0)}
                </span>
              </div>
              <div>
                <p className="text-white font-medium">{transaction.name}</p>
                <p className="text-gray-400 text-sm">{transaction.reference}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-400">Type:</span>
              <span className="text-white">{transaction.type}</span>
            </div>
          </div>

          {/* Amount */}
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Amount</label>
            <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
              <input
                type="number"
                placeholder="Enter amount"
                title="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                min="0"
                step="0.01"
              />
            </div>
            <p className="text-gray-500 text-sm mt-1">
              Original: ₹{Math.abs(transaction.amount).toLocaleString()}
            </p>
          </div>

          {/* Category */}
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Category</label>
            <div className="relative">
              <Tag className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <select
                title="Select category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
                required
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div>
            <label className="block text-gray-400 text-sm font-medium mb-2">Date</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
                required
                title="Select date"
              />
            </div>
          </div>

        {/* Status */}
        <div>
        <label className="block text-gray-400 text-sm font-medium mb-2">Status</label>
        <div className="relative">
            <select
            title="Select status"
            value={formData.status || transaction.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
            className="w-full pl-4 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 appearance-none"
            required
            >
            <option value="Paid">Paid</option>
            <option value="Pending">Pending</option>
            </select>
        </div>
        </div>

          {/* Warning */}
          <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4">
            <p className="text-yellow-400 text-sm">
              <strong>Note:</strong> Editing this transaction will update your financial records. 
              Make sure the changes are accurate.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>Save Changes</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTransactionModal;