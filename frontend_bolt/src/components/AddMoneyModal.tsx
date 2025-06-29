import React, { useState } from 'react';
import { X, Plus, CreditCard, Building, Smartphone, Check } from 'lucide-react';

interface AddMoneyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AddMoneyModal: React.FC<AddMoneyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [step, setStep] = useState(1);
  const [selectedMethod, setSelectedMethod] = useState('card');
  const [amount, setAmount] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  const paymentMethods = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Add money instantly',
      fee: 'Free'
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building,
      description: '1-3 business days',
      fee: 'Free'
    },
    {
      id: 'mobile',
      name: 'Mobile Payment',
      icon: Smartphone,
      description: 'Apple Pay, Google Pay',
      fee: 'Free'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1 && amount) {
      setStep(2);
    } else if (step === 2) {
      setStep(3);
      // Here you would process the payment
      setTimeout(() => {
        onClose();
        setStep(1);
        setAmount('');
        setCardData({ number: '', expiry: '', cvv: '', name: '' });
      }, 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Add Money</h2>
          <button
            type="button"
            title="Close"
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Amount to add</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-4 bg-gray-700 border border-gray-600 rounded-lg text-white text-2xl font-semibold placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 text-center"
                    required
                    min="1"
                    step="0.01"
                  />
                </div>
              </div>

              {/* Quick Amount Buttons */}
              <div className="grid grid-cols-3 gap-3">
                {[25, 50, 100, 200, 500, 1000].map((quickAmount) => (
                  <button
                    key={quickAmount}
                    type="button"
                    onClick={() => setAmount(quickAmount.toString())}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg font-medium transition-colors duration-200"
                  >
                    ₹{quickAmount}
                  </button>
                ))}
              </div>

              {/* Payment Methods */}
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-3">Payment method</label>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setSelectedMethod(method.id)}
                      className={`w-full p-4 rounded-lg border-2 transition-all duration-200 ${
                        selectedMethod === method.id
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-600 bg-gray-700/50 hover:border-gray-500'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          selectedMethod === method.id ? 'bg-purple-500' : 'bg-gray-600'
                        }`}>
                          <method.icon className="h-5 w-5 text-white" />
                        </div>
                        <div className="flex-1 text-left">
                          <p className="text-white font-medium">{method.name}</p>
                          <p className="text-gray-400 text-sm">{method.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-emerald-400 text-sm font-medium">{method.fee}</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
              >
                Continue
              </button>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-2">Add ₹{amount}</h3>
                <p className="text-gray-400">
                  {paymentMethods.find(m => m.id === selectedMethod)?.name}
                </p>
              </div>

              {selectedMethod === 'card' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Card Number</label>
                    <input
                      type="text"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">Expiry Date</label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm font-medium mb-2">CVV</label>
                      <input
                        type="text"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-gray-400 text-sm font-medium mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      placeholder="John Doe"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      required
                    />
                  </div>
                </div>
              )}

              {selectedMethod === 'bank' && (
                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
                  <p className="text-blue-400 text-sm">
                    You'll be redirected to your bank's secure website to complete the transfer.
                  </p>
                </div>
              )}

              {selectedMethod === 'mobile' && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400 text-sm">
                    Use your device's biometric authentication to complete the payment.
                  </p>
                </div>
              )}

              <div className="bg-gray-700/50 rounded-lg p-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-white font-semibold">₹{amount}</span>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-400">Fee:</span>
                  <span className="text-emerald-400">Free</span>
                </div>
                <div className="border-t border-gray-600 mt-3 pt-3 flex justify-between items-center">
                  <span className="text-gray-400">Total:</span>
                  <span className="text-white font-bold text-lg">₹{amount}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add Money</span>
                </button>
              </div>
            </form>
          )}

          {step === 3 && (
            <div className="text-center space-y-6">
              <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto">
                <Check className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Money Added Successfully!</h3>
                <p className="text-gray-400">
                  ₹{amount} has been added to your wallet
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddMoneyModal;