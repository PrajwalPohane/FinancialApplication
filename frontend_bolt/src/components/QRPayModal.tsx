import React, { useState } from 'react';
import { X, QrCode, Scan, Camera, Upload, Check, Download } from 'lucide-react';

interface QRPayModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const QRPayModal: React.FC<QRPayModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [mode, setMode] = useState<'generate' | 'scan'>('generate');
  const [amount, setAmount] = useState('');
  const [message, setMessage] = useState('');
  const [qrGenerated, setQrGenerated] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const generateQR = (e: React.FormEvent) => {
    e.preventDefault();
    setQrGenerated(true);
  };

  const handleScan = () => {
    // Simulate QR scan result
    setScanResult({
      recipient: 'Matheus Ferrero',
      amount: '125.50',
      message: 'Coffee payment'
    });
  };

  const confirmPayment = () => {
    // Process payment
    setTimeout(() => {
      onClose();
      setScanResult(null);
      setQrGenerated(false);
      setAmount('');
      setMessage('');
    }, 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-2xl border border-gray-700 w-full max-w-md">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">QR Pay</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200"
            title="Close"
          >
            <X className="h-5 w-5 text-gray-400" />
          </button>
        </div>

        {/* Mode Toggle */}
        <div className="p-6 border-b border-gray-700">
          <div className="flex bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setMode('generate')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                mode === 'generate'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <QrCode className="h-4 w-4" />
              <span>Generate QR</span>
            </button>
            <button
              onClick={() => setMode('scan')}
              className={`flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-all duration-200 ${
                mode === 'scan'
                  ? 'bg-orange-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Scan className="h-4 w-4" />
              <span>Scan QR</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {mode === 'generate' && !qrGenerated && (
            <form onSubmit={generateQR} className="space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Amount (optional)</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">₹</span>
                  <input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-2">Message (optional)</label>
                <textarea
                  placeholder="What's this payment for?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                  rows={3}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                <QrCode className="h-4 w-4" />
                <span>Generate QR Code</span>
              </button>
            </form>
          )}

          {mode === 'generate' && qrGenerated && (
            <div className="space-y-6 text-center">
              <div>
                <h3 className="text-lg font-semibold text-white mb-4">Your QR Code</h3>
                
                {/* QR Code Placeholder */}
                <div className="w-48 h-48 bg-white rounded-lg mx-auto mb-4 flex items-center justify-center">
                  <div className="w-40 h-40 bg-black rounded-lg flex items-center justify-center">
                    <QrCode className="h-20 w-20 text-white" />
                  </div>
                </div>

                <div className="bg-gray-700/50 rounded-lg p-4 text-left">
                  {amount && (
                    <div className="flex justify-between mb-2">
                      <span className="text-gray-400">Amount:</span>
                      <span className="text-orange-400 font-semibold">${amount}</span>
                    </div>
                  )}
                  {message && (
                    <div className="flex justify-between">
                      <span className="text-gray-400">Message:</span>
                      <span className="text-white">{message}</span>
                    </div>
                  )}
                  {!amount && !message && (
                    <p className="text-gray-400 text-center">Open amount QR code</p>
                  )}
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setQrGenerated(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Back
                </button>
                <button
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                >
                  <Download className="h-4 w-4" />
                  <span>Save</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'scan' && !scanResult && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-semibold text-white mb-4">Scan QR Code</h3>
                
                {/* Camera Placeholder */}
                <div className="w-64 h-64 bg-gray-700 rounded-lg mx-auto mb-4 flex items-center justify-center border-2 border-dashed border-gray-600">
                  <div className="text-center">
                    <Camera className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                    <p className="text-gray-400 text-sm">Position QR code in frame</p>
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={handleScan}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Scan className="h-4 w-4" />
                    <span>Scan</span>
                  </button>
                  <button
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2"
                  >
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {mode === 'scan' && scanResult && (
            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Check className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">QR Code Scanned</h3>
                <p className="text-gray-400">Confirm payment details</p>
              </div>

              <div className="bg-gray-700/50 rounded-lg p-4 space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Pay to:</span>
                  <span className="text-white">{scanResult.recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Amount:</span>
                  <span className="text-orange-400 font-semibold">${scanResult.amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Message:</span>
                  <span className="text-white">{scanResult.message}</span>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={() => setScanResult(null)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPayment}
                  className="flex-1 bg-orange-600 hover:bg-orange-700 text-white py-3 rounded-lg font-medium transition-colors duration-200"
                >
                  Pay ${scanResult.amount}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default QRPayModal;