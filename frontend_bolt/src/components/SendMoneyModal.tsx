import React, { useState } from 'react';
import { X, Send, User, DollarSign, MessageSquare, Check } from 'lucide-react';
import { useFinancialData } from '../hooks/useFinancialData';

interface SendMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SendMoneyModal: React.FC<SendMoneyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    recipient: '',
    amount: '',
    message: '',
    method: 'email'
  });

  const recentContacts = [
    { id: 1, name: 'Matheus Ferrero', email: 'matheus@example.com', avatar: 'M' },
    { id: 2, name: 'Floyd Miles', email: 'floyd@example.com', avatar: 'F' },
    { id: 3, name: 'Jerome Bell', email: 'jerome@example.com', avatar: 'J' },
    { id: 4, name: 'Savannah Nguyen', email: 'savannah@example.com', avatar: 'S' }
  ];

  // Get real available balance
  const { summary } = useFinancialData();
  const availableBalance = summary ? summary.totalRevenue - summary.totalExpenses : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && formData.recipient && formData.amount) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      // Here you would typically send the money
      setTimeout(() => {
        onClose();
        setStep(1);
        setFormData({ recipient: '', amount: '', message: '', method: 'email' });
      }, 2000);
    }
  };

  const selectContact = (contact: any) => {
    setFormData({ ...formData, recipient: contact.email });
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Send Money</h2>
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
        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Recipient Selection */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">Send to</label>
                <div className="space-y-3">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => setFormData({ ...formData, method: 'email' })}
                      className={`flex-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                        formData.method === 'email'
                          ? 'bg-emerald-600 text-white'
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
                          ? 'bg-emerald-600 text-white'
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
                      value={formData.recipient}
                      onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      required
                    />
                  </div>
                </div>

                {/* Recent Contacts */}
                <div className="mt-4">
                  <p className="text-gray-400 text-sm mb-3">Recent contacts</p>
                  <div className="grid grid-cols-4 gap-3">
                    {recentContacts.map((contact) => (
                      <button
                        key={contact.id}
                        type="button"
                        onClick={() => selectContact(contact)}
                        className="flex flex-col items-center p-3 hover:bg-gray-700 rounded-lg transition-colors duration-200"
                      >
                        <div className="w-10 h-10 bg-emerald-500 rounded-full flex items-center justify-center mb-2">
                          <span className="text-white text-sm font-medium">{contact.avatar}</span>
                        </div>
                        <span className="text-gray-300 text-xs text-center">{contact.name.split(' ')[0]}</span>
                      </button>
                    ))}
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
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <p className="text-gray-500 text-sm mt-2">Available balance: ₹{availableBalance.toLocaleString()}</p>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-4 gap-2">
                {[10, 25, 50, 100].map((amount) => (
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
                <label className="block text-gray-400 text-sm font-medium mb-2">Message (optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 text-gray-400 h-4 w-4" />
                  <textarea
                    placeholder="Add a note..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                    rows={3}
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Confirm Transfer</h3>
                <p className="text-gray-400">Please review the details before sending</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">To:</span>
                  <span className="text-white">{formData.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-emerald-400 font-semibold">${formData.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-white">$0.00</span>
                </div>
                <div className="border-t border-gray-600 pt-3 flex justify-between">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-semibold">${formData.amount}</span>
                </div>
                {formData.message && (
                  <div className="border-t border-gray-600 pt-3">
                    <span className="text-gray-400">Message:</span>
                    <p className="text-white mt-1">{formData.message}</p>
                  </div>
                )}
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  onClick={handleSubmit}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Send className="h-4 w-4" />
                  <span>Send Money</span>
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-emerald-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Money Sent Successfully!</h3>
                <p className="text-gray-400">
                  ${formData.amount} has been sent to {formData.recipient}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SendMoneyModal;