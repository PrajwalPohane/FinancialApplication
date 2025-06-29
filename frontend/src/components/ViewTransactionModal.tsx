import React from 'react';
import { X, ArrowUpRight, ArrowDownLeft, Copy, Download, Share, MapPin, Clock, CreditCard } from 'lucide-react';

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

interface ViewTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
}

const ViewTransactionModal: React.FC<ViewTransactionModalProps> = ({ isOpen, onClose, transaction }) => {
  if (!isOpen || !transaction) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const copyReference = () => {
    navigator.clipboard.writeText(transaction.reference);
  };

  const downloadReceipt = () => {
    // Simulate receipt download
    console.log('Downloading receipt for transaction:', transaction.reference);
  };

  const shareTransaction = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Transaction Details',
        text: `Transaction ${transaction.reference} - ${transaction.amount > 0 ? '+' : ''}$${Math.abs(transaction.amount)}`,
        url: window.location.href
      });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Transaction Details</h2>
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
        <div className="p-6 space-y-6 overflow-y-auto" style={{ maxHeight: '70vh' }}>
          {/* Transaction Header */}
          <div className="text-center">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 ${
              transaction.amount > 0 ? 'bg-emerald-500/10' : 'bg-red-500/10'
            }`}>
              {transaction.amount > 0 ? (
                <ArrowDownLeft className="h-8 w-8 text-emerald-400" />
              ) : (
                <ArrowUpRight className="h-8 w-8 text-red-400" />
              )}
            </div>
            <h3 className={`text-3xl font-bold mb-2 ${
              transaction.amount > 0 ? 'text-emerald-400' : 'text-red-400'
            }`}>
              {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toLocaleString()}
            </h3>
            <p className="text-gray-400">{transaction.type}</p>
          </div>

          {/* Status */}
          <div className="flex justify-center">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(transaction.status)}`}>
              {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
            </span>
          </div>

          {/* Transaction Details */}
          <div className="bg-gray-700/50 rounded-lg p-4 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-400">Reference ID</span>
              <div className="flex items-center space-x-2">
                <span className="text-white font-mono">{transaction.reference}</span>
                <button
                  onClick={copyReference}
                  className="p-1 hover:bg-gray-600 rounded transition-colors duration-200"
                  title="Copy reference"
                >
                  <Copy className="h-4 w-4 text-gray-400" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Date & Time</span>
              <div className="text-right">
                <p className="text-white">{new Date(transaction.date).toLocaleDateString()}</p>
                <p className="text-gray-400 text-sm">{transaction.time}</p>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">Category</span>
              <span className="text-white">{transaction.category}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-gray-400">{transaction.amount > 0 ? 'From' : 'To'}</span>
              <div className="text-right">
                <p className="text-white">{transaction.name}</p>
                <p className="text-gray-400 text-sm">{transaction.email}</p>
              </div>
            </div>

            {transaction.description && (
              <div className="border-t border-gray-600 pt-4">
                <span className="text-gray-400 block mb-2">Description</span>
                <p className="text-white">{transaction.description}</p>
              </div>
            )}
          </div>

          {/* Additional Information */}
          <div className="bg-gray-700/30 rounded-lg p-4 space-y-3">
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-white text-sm">Processing Time</p>
                <p className="text-gray-400 text-xs">
                  {transaction.status === 'completed' ? 'Instant' : 'Processing...'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <CreditCard className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-white text-sm">Payment Method</p>
                <p className="text-gray-400 text-xs">Primary Wallet</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <MapPin className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-white text-sm">Location</p>
                <p className="text-gray-400 text-xs">New York, NY</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={downloadReceipt}
              className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Download className="h-4 w-4" />
              <span>Receipt</span>
            </button>
            <button
              onClick={shareTransaction}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
            >
              <Share className="h-4 w-4" />
              <span>Share</span>
            </button>
          </div>

          {/* Support */}
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              Need help with this transaction?{' '}
              <button className="text-emerald-400 hover:text-emerald-300 underline">
                Contact Support
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewTransactionModal;