import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Send, 
  Download, 
  Eye,
  EyeOff,
  QrCode,
  ArrowUpRight,
  ArrowDownLeft,
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import SendMoneyModal from '../components/SendMoneyModal';
import RequestMoneyModal from '../components/RequestMoneyModal';
import AddMoneyModal from '../components/AddMoneyModal';
import QRPayModal from '../components/QRPayModal';
import { useFinancialData } from '../hooks/useFinancialData';
import { apiClient, Transaction } from '../services/api';

const WalletPage: React.FC = () => {
  const [showBalance, setShowBalance] = useState(true);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modal, setModal] = useState<'send' | 'request' | 'add' | 'qr' | null>(null);
  
  // Get financial data for calculations
  const { summary } = useFinancialData();

  // Calculate wallet data
  const totalBalance = summary ? summary.totalRevenue - summary.totalExpenses : 0;
  
  // Calculate current month data
  const [monthlyIncome, setMonthlyIncome] = useState(0);
  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const currentDate = new Date();
        const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        
        const response = await apiClient.getTransactions({
          startDate: startOfMonth.toISOString(),
          endDate: endOfMonth.toISOString(),
          limit: 1000 // Get all transactions for the month
        });
        
        if (response.success) {
          const transactions = response.data.transactions;
          const income = transactions
            .filter(t => t.category === 'Revenue')
            .reduce((sum, t) => sum + t.amount, 0);
          const expenses = transactions
            .filter(t => t.category === 'Expense')
            .reduce((sum, t) => sum + Math.abs(t.amount), 0);
          
          setMonthlyIncome(income);
          setMonthlyExpenses(expenses);
        }
      } catch (error) {
        console.error('Error fetching monthly data:', error);
      }
    };

    const fetchRecentTransactions = async () => {
      try {
        const response = await apiClient.getTransactions({ 
          page: 1, 
          limit: 4, 
          sortBy: 'date', 
          sortOrder: 'desc' 
        });
        if (response.success) {
          setRecentTransactions(response.data.transactions);
        }
      } catch (error) {
        console.error('Error fetching recent transactions:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMonthlyData();
    fetchRecentTransactions();
  }, []);

  const quickActions = [
    { icon: Send, label: 'Send Money', color: 'bg-emerald-500/10 text-emerald-400', onClick: () => setModal('send') },
    { icon: Download, label: 'Request', color: 'bg-blue-500/10 text-blue-400', onClick: () => setModal('request') },
    { icon: Plus, label: 'Add Money', color: 'bg-purple-500/10 text-purple-400', onClick: () => setModal('add') },
    { icon: QrCode, label: 'QR Pay', color: 'bg-orange-500/10 text-orange-400', onClick: () => setModal('qr') }
  ]

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const transactionDate = new Date(date);
    const diffInHours = Math.floor((now.getTime() - transactionDate.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return transactionDate.toLocaleDateString();
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Wallet</h1>
              <p className="text-gray-400 mt-1">Manage your cards and balance</p>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Total Balance Card */}
          <div className="bg-gradient-to-r from-emerald-500 to-emerald-600 rounded-2xl p-8 text-white">
            <div className="flex items-center justify-between mb-6">
              <div>
                <p className="text-emerald-100 text-sm font-medium">Total Balance</p>
                <div className="flex items-center space-x-3 mt-2">
                  <h2 className="text-4xl font-bold">
                    {showBalance ? `₹${totalBalance.toLocaleString()}` : '••••••••'}
                  </h2>
                  <button
                    onClick={() => setShowBalance(!showBalance)}
                    className="p-2 hover:bg-emerald-600 rounded-lg transition-colors duration-200"
                  >
                    {showBalance ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-emerald-100 text-sm">Monthly Change</p>
                <p className="text-2xl font-bold text-emerald-100">
                  {monthlyIncome - monthlyExpenses >= 0 ? '+' : ''}{((monthlyIncome - monthlyExpenses) / totalBalance * 100).toFixed(1)}%
                </p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-emerald-200 text-sm">This Month Income</p>
                <p className="text-xl font-semibold">+₹{monthlyIncome.toLocaleString()}</p>
              </div>
              <div>
                <p className="text-emerald-200 text-sm">This Month Expenses</p>
                <p className="text-xl font-semibold">-₹{monthlyExpenses.toLocaleString()}</p>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {quickActions.map((action, index) => (
              <button
                key={index}
                className="bg-gray-800 border border-gray-700 rounded-lg p-6 hover:bg-gray-700 transition-all duration-200 group"
                onClick={action.onClick}
              >
                <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <action.icon className="h-6 w-6" />
                </div>
                <p className="text-white font-medium">{action.label}</p>
              </button>
            ))}
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-white">Recent Activity</h3>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              {recentTransactions.map((activity) => (
                <div key={activity.id} className="flex items-center justify-between p-4 hover:bg-gray-700/30 rounded-lg transition-colors duration-200">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.amount > 0 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'
                    }`}>
                      {activity.amount > 0 ? (
                        <ArrowDownLeft className="h-5 w-5" />
                      ) : (
                        <ArrowUpRight className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-white font-medium">{activity.description || `Transaction #${activity.id}`}</p>
                      <p className="text-gray-400 text-sm">{formatTimeAgo(activity.date)}</p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`font-semibold ${
                      activity.category === 'Revenue' ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {activity.category === 'Revenue' ? '+' : '-'}₹{Math.abs(activity.amount).toLocaleString()}
                    </p>
                    <p className="text-gray-400 text-sm capitalize">{activity.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <SendMoneyModal isOpen={modal === 'send'} onClose={() => setModal(null)} />
      <RequestMoneyModal isOpen={modal === 'request'} onClose={() => setModal(null)} />
      <AddMoneyModal isOpen={modal === 'add'} onClose={() => setModal(null)} />
      <QRPayModal isOpen={modal === 'qr'} onClose={() => setModal(null)} />
    </div>
  );
};

export default WalletPage;