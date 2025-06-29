import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  PieChart, 
  Download,
  ArrowUpRight,
  ArrowDownLeft,
  DollarSign,
  Target
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { useFinancialData } from '../hooks/useFinancialData';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import TimeRangeSelector from '../components/TimeRangeSelector';
import toast from 'react-hot-toast';
import { apiClient } from '../services/api';
ChartJS.register(ArcElement, Tooltip, Legend);

const AnalyticsPage: React.FC = () => {
  const { timeRange, setTimeRange, customRange, summary, categoryBreakdown, statusBreakdown} = useFinancialData();
  const [pieType, setPieType] = useState<'category' | 'status'>('category');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  // Pie chart data for category and status
  const pieDataCategory = {
    labels: ['Revenue', 'Expense'],
    datasets: [
      {
        data: [categoryBreakdown?.Revenue || 0, categoryBreakdown?.Expense || 0],
        backgroundColor: ['#10B981', '#F59E0B'],
        borderColor: ['#059669', '#D97706'],
        borderWidth: 2,
      },
    ],
  };
  const pieDataStatus = {
    labels: ['Paid', 'Pending', 'Failed', 'Cancelled'],
    datasets: [
      {
        data: [statusBreakdown?.Paid || 0, statusBreakdown?.Pending || 0, statusBreakdown?.Failed || 0, statusBreakdown?.Cancelled || 0],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444', '#6B7280'],
        borderColor: ['#059669', '#D97706', '#B91C1C', '#374151'],
        borderWidth: 2,
      },
    ],
  };
  const pieData = pieType === 'category' ? pieDataCategory : pieDataStatus;
  const pieLabels = pieData.labels;
  const pieValues = pieData.datasets[0].data;
  const pieColors = pieData.datasets[0].backgroundColor;

  const handleExportReport = async () => {
    setIsExporting(true);
    try {
      const params: { timeRange?: 'all' | 'selectrange' | 'last30days' | 'monthly'; startDate?: string; endDate?: string } = { timeRange: timeRange as 'all' | 'selectrange' | 'last30days' | 'monthly' };
      if (timeRange === 'selectrange' && customRange.startDate && customRange.endDate) {
        params.startDate = customRange.startDate.toISOString();
        params.endDate = customRange.endDate.toISOString();
      }
      const blob = await apiClient.exportAnalytics(params);
      const filename = `analytics_report_${new Date().toISOString().split('T')[0]}.csv`;
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success('Report exported successfully');
    } catch (error) {
      toast.error('Failed to export report');
    } finally {
      setIsExporting(false);
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
              <h1 className="text-2xl font-bold text-white">Analytics</h1>
              <p className="text-gray-400 mt-1">Track your financial performance and insights</p>
            </div>
            <div className="flex items-center space-x-4">
              <TimeRangeSelector
                value={timeRange}
                onChange={setTimeRange}
                customRange={customRange}
                options={[
                  { value: 'all', label: 'All Transactions' },
                  { value: 'last30days', label: 'Last 30 days' },
                  { value: 'selectrange', label: 'Select Range' }
                ]}
              />
              <button
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 disabled:opacity-50"
                onClick={handleExportReport}
                disabled={isExporting}
              >
                {isExporting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    Exporting...
                  </>
                ) : (
                  <>
                <Download className="h-4 w-4" />
                <span>Export Report</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </header>
        <div className="p-8 space-y-8">
          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Revenue</p>
                  <p className="text-emerald-400 text-2xl font-bold mt-2">
                    ₹{summary ? summary.totalRevenue.toLocaleString() : '0'}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-emerald-400 mr-1" />
                    <span className="text-emerald-400 text-sm">{summary ? '+' : ''}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-emerald-500/10">
                  <TrendingUp className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Total Expenses</p>
                  <p className="text-red-400 text-2xl font-bold mt-2">
                    ₹{summary ? summary.totalExpenses.toLocaleString() : '0'}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowDownLeft className="h-4 w-4 text-red-400 mr-1" />
                    <span className="text-red-400 text-sm">-</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-red-500/10">
                  <TrendingDown className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Net Profit</p>
                  <p className="text-blue-400 text-2xl font-bold mt-2">
                    ₹{summary ? summary.netIncome.toLocaleString() : '0'}
                  </p>
                  <div className="flex items-center mt-2">
                    <ArrowUpRight className="h-4 w-4 text-blue-400 mr-1" />
                    <span className="text-blue-400 text-sm">{summary ? '+' : ''}</span>
                  </div>
                </div>
                <div className="p-3 rounded-lg bg-blue-500/10">
                  <DollarSign className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
            <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm font-medium">Transaction Count</p>
                  <p className="text-purple-400 text-2xl font-bold mt-2">
                    {summary ? summary.transactionCount : 0}
                  </p>
                </div>
                <div className="p-3 rounded-lg bg-purple-500/10">
                  <Target className="h-6 w-6 text-purple-400" />
                </div>
              </div>
            </div>
          </div>
          {/* Charts Section */}
          {/* You can add a chart here using the data and chartKey from useFinancialData */}
          {/* Category Breakdown (now full width) */}
          <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 w-full">
            <div className="flex items-center justify-between mb-6 relative">
              <h3 className="text-xl font-semibold text-white">Category Breakdown</h3>
              <div className="relative">
                <button
                  className="p-2 rounded-full hover:bg-gray-700 focus:outline-none"
                  onClick={() => setDropdownOpen((open) => !open)}
                  title="Change Pie Chart"
                >
                  <PieChart className="h-5 w-5 text-gray-400" />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10">
                    <button
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${pieType === 'category' ? 'text-emerald-400' : 'text-gray-300'}`}
                      onClick={() => { setPieType('category'); setDropdownOpen(false); }}
                    >
                      Revenue vs Expenses
                    </button>
                    <button
                      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-700 ${pieType === 'status' ? 'text-emerald-400' : 'text-gray-300'}`}
                      onClick={() => { setPieType('status'); setDropdownOpen(false); }}
                    >
                      Paid vs Pending
                    </button>
                  </div>
                )}
              </div>
            </div>
            <div className="mb-6 flex justify-center">
              <div className="w-72 h-72">
                <Pie 
                  data={pieData} 
                  options={{
                    plugins: {
                      legend: {
                        display: true,
                        position: 'right',
                        align: 'center',
                        labels: {
                          color: '#D1D5DB',
                          font: {
                            size: 13,
                            family: 'Inter, system-ui, sans-serif',
                            weight: 300
                          },
                          padding: 12
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
            <div className="space-y-2">
              {pieLabels.map((label, idx) => (
                <div key={label} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 rounded-full" style={{ backgroundColor: pieColors[idx] as string }}></div>
                    <span className="text-gray-300">{label}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-medium">{pieValues[idx]}</p>
                    {summary && summary.transactionCount ? (
                      <p className="text-gray-400 text-sm">{Math.round((Number(pieValues[idx]) / summary.transactionCount) * 100)}%</p>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;