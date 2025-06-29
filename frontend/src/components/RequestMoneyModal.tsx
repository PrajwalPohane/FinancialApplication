import React, { useState } from 'react';
import { X, Download, User, MessageSquare, Check, Copy, Share } from 'lucide-react';
import { apiClient } from '../services/api';

interface RequestMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const RequestMoneyModal: React.FC<RequestMoneyModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    from: '',
    amount: '',
    message: '',
    method: 'email'
  });

  const [requestLink] = useState('https://penta.app/request/abc123def456');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && formData.from && formData.amount) {
      setIsLoading(true);
      try {
        await apiClient.createTransaction({
          amount: Number(formData.amount),
          category: 'Revenue',
          status: 'Pending',
          description: formData.message || 'Payment request',
          // user_profile and date are set in backend schema
        });
        setStep(2);
      } catch (err) {
        // Optionally show error toast
      } finally {
        setIsLoading(false);
      }
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(requestLink);
  };

  const shareRequest = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Payment Request',
        text: `Please send me ₹${formData.amount}`,
        url: requestLink
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Request Money</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Close"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Request From */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">Request from</label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, method: 'email' })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        formData.method === 'email'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Email
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, method: 'phone' })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        formData.method === 'phone'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      Phone
                    </button>
                  </div>
                  
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <input
                      type={formData.method === 'email' ? 'email' : 'tel'}
                      placeholder={formData.method === 'email' ? 'Enter email address' : 'Enter phone number'}
                      value={formData.from}
                      onChange={(e) => setFormData({ ...formData, from: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Amount</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[20, 50, 100, 200].map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    onClick={() => setFormData({ ...formData, amount: amount.toString() })}
                    className="px-3 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg text-sm transition-colors duration-200"
                  >
                    ₹{amount}
                  </button>
                ))}
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Reason (optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <textarea
                    placeholder="What's this for?"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Creating...
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4" />
                    <span>Create Request</span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Request Created!</h3>
                <p className="text-gray-400">
                  Your payment request for ₹{formData.amount} has been created
                </p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">From:</span>
                  <span className="text-white">{formData.from}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-blue-400 font-semibold">₹{formData.amount}</span>
                </div>
                {formData.message && (
                  <div className="border-t border-gray-600 pt-3">
                    <span className="text-gray-400">Reason:</span>
                    <p className="text-white mt-1">{formData.message}</p>
                  </div>
                )}
              </div>

              <div className="bg-gray-700/30 rounded-lg p-4">
                <p className="text-gray-400 text-sm mb-2">Share this link:</p>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={requestLink}
                    readOnly
                    className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm"
                    placeholder="Payment request link"
                    title="Payment request link"
                  />
                  <button
                    type="button"
                    onClick={copyLink}
                    className="p-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition-colors duration-200"
                    title="Copy link"
                  >
                    <Copy className="h-4 w-4 text-white" />
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={shareRequest}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Share className="h-4 w-4" />
                  <span>Share</span>
                </button>
                <button
                  onClick={onClose}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Done
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RequestMoneyModal;