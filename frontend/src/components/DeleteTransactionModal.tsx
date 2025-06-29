import React, { useState } from 'react';
import { X, Trash2, AlertTriangle, Check } from 'lucide-react';
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

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  onDelete: (transactionId: number) => void;
}

const DeleteTransactionModal: React.FC<DeleteTransactionModalProps> = ({ 
  isOpen, 
  onClose, 
  transaction, 
  onDelete 
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [step, setStep] = useState(1);

  const handleDelete = async () => {
    if (transaction && confirmText === 'DELETE') {
      setIsDeleting(true);
      setStep(2);
      try {
        await apiClient.deleteTransaction(transaction.id);
        toast.success('Transaction deleted successfully');
        onDelete(transaction.id);
        setStep(3);
        setTimeout(() => {
          onClose();
          setStep(1);
          setConfirmText('');
          setIsDeleting(false);
        }, 2000);
      } catch (error: any) {
        toast.error(error.message || 'Failed to delete transaction');
        setIsDeleting(false);
      }
    }
  };

  const handleClose = () => {
    if (!isDeleting) {
      onClose();
      setStep(1);
      setConfirmText('');
    }
  };

  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Delete Transaction</h2>
          {!isDeleting && (
            <button
              type="button"
              title="closebutton"
              onClick={handleClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            >
              <X className="h-5 w-5 text-gray-400" />
            </button>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <div className="space-y-6">
              {/* Warning Icon */}
              <div className="text-center">
                <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Delete Transaction</h3>
                <p className="text-gray-400">
                  This action cannot be undone. This will permanently delete the transaction.
                </p>
              </div>

              {/* Transaction Details */}
              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {transaction.name.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-medium">{transaction.name}</p>
                    <p className="text-gray-400 text-sm">{transaction.description}</p>
                  </div>
                  <div className="text-right">
                    <p className={`font-semibold ${
                      transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm">{new Date(transaction.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="text-center">
                  <span className="text-gray-400 text-sm">Ref: {transaction.reference}</span>
                </div>
              </div>

              {/* Confirmation Input */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">
                  Type <span className="text-red-400 font-bold">DELETE</span> to confirm
                </label>
                <input
                  type="text"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  placeholder="DELETE"
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>

              {/* Impact Warning */}
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <h4 className="text-red-400 font-medium mb-2">This will affect:</h4>
                <ul className="text-red-300 text-sm space-y-1">
                  <li>• Your account balance calculations</li>
                  <li>• Monthly and yearly financial reports</li>
                  <li>• Transaction history and analytics</li>
                  <li>• Any linked budgets or goals</li>
                </ul>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3">
                <button
                  onClick={handleClose}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={confirmText !== 'DELETE'}
                  className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete Transaction</span>
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-400"></div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Deleting Transaction...</h3>
                <p className="text-gray-400">Please wait while we process your request</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Transaction Deleted</h3>
                <p className="text-gray-400">
                  The transaction has been permanently removed from your records
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeleteTransactionModal;