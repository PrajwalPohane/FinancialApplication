import React, { useEffect, useState } from 'react';
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Wallet,
  Search,
  Bell
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import FinancialChart from '../components/FinancialChart';
import TimeRangeSelector from '../components/TimeRangeSelector';
import { useFinancialData } from '../hooks/useFinancialData';
import { apiClient, Transaction } from '../services/api';

const DashboardPage: React.FC = () => {
  const { timeRange, setTimeRange, customRange, data, chartKey, summary } = useFinancialData();
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    // Fetch the latest 3 transactions
    apiClient.getTransactions({ page: 1, limit: 3, sortBy: 'date', sortOrder: 'desc' })
      .then(res => {
        if (res.success) setRecentTransactions(res.data.transactions);
      });
  }, []);

  const stats = [
    {
      title: 'Balance',
      amount: summary ? `₹${(summary.totalRevenue - summary.totalExpenses).toLocaleString()}` : '₹0',
      icon: Wallet,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Revenue',
      amount: summary ? `₹${summary.totalRevenue.toLocaleString()}` : '₹0',
      icon: TrendingUp,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10'
    },
    {
      title: 'Expenses',
      amount: summary ? `₹${summary.totalExpenses.toLocaleString()}` : '₹0',
      icon: TrendingDown,
      color: 'text-red-400',
      bgColor: 'bg-red-500/10'
    },
    {
      title: 'Savings',
      amount: summary ? `₹${(summary.totalRevenue - summary.totalExpenses).toLocaleString()}` : '₹0',
      icon: DollarSign,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/10'
    }
  ];

  const currentPeriodIncome = data.income.reduce((sum, val) => sum + val, 0);
  const currentPeriodExpenses = data.expenses.reduce((sum, val) => sum + val, 0);
  const netAmount = currentPeriodIncome - currentPeriodExpenses;

  const getPeriodLabel = () => {
    if (timeRange === 'selectrange' && customRange.startDate && customRange.endDate) {
      const start = customRange.startDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      const end = customRange.endDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      return `${start} - ${end}`;
    } else if (timeRange === 'last30days') {
      return 'Last 30 Days';
    } else {
      return 'Last 12 Months';
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Dashboard</h1>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="bg-gray-800 rounded-lg p-6 border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium">{stat.title}</p>
                    <p className="text-white text-2xl font-bold mt-2">{stat.amount}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overview Chart & Recent Transactions */}
          <div className="w-full">
            {/* Overview Chart */}
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 w-full">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-white text-xl font-semibold">Financial Overview</h3>
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Income</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span className="text-gray-400 text-sm">Expenses</span>
                  </div>
                  <TimeRangeSelector
                    value={timeRange}
                    onChange={setTimeRange}
                    customRange={customRange}
                  />
                </div>
              </div>
              
              {/* Chart Container */}
              <div className="h-80">
                <FinancialChart 
                  timeRange={chartKey === 'day' ? 'daily' : chartKey === 'week' ? 'weekly' : 'monthly'}
                  chartKey={chartKey}
                  data={data} 
                />
              </div>

              {/* Chart Summary */}
              <div className="mt-6 pt-4 border-t border-gray-700">
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      {getPeriodLabel()} Income
                    </p>
                    <p className="text-emerald-400 text-lg font-semibold">
                      ₹{currentPeriodIncome.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">
                      {getPeriodLabel()} Expenses
                    </p>
                    <p className="text-orange-500 text-lg font-semibold">
                      ₹{currentPeriodExpenses.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-center">
                    <p className="text-gray-400 text-sm">Net Amount</p>
                    <p className={`text-lg font-semibold ${
                      netAmount >= 0 ? 'text-emerald-400' : 'text-red-400'
                    }`}>
                      {netAmount >= 0 ? '+' : ''}₹{netAmount.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-gray-800 rounded-lg border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-center justify-between">
                <h3 className="text-white text-xl font-semibold">Recent Transactions</h3>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-700/50">
                  <tr>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Name</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Date</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Amount</th>
                    <th className="text-left text-gray-400 font-medium px-6 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                  {recentTransactions.map((transaction) => (
                    <tr key={transaction.id} className="hover:bg-gray-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-xs font-medium">
                              {transaction.user_profile ? '' : transaction.user_id?.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-white font-medium">{transaction.description || 'No description'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {new Date(transaction.date).toLocaleDateString()}
                      </td>
                      <td className={`px-6 py-4 font-medium ${
                        transaction.category === 'Revenue' ? 'text-emerald-400' : 'text-red-400'
                      }`}>
                        {transaction.category === 'Revenue' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                          Completed
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;