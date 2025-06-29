import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Download, 
  Calendar,
  ArrowUpRight,
  ArrowDownLeft,
  Eye,
  Edit,
  Trash2,
  Loader2
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import { apiClient, Transaction, downloadCSV } from '../services/api';
import toast from 'react-hot-toast';
import ViewTransactionModal from '../components/ViewTransactionModal';
import EditTransactionModal from '../components/EditTransactionModal';
import DeleteTransactionModal from '../components/DeleteTransactionModal';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

function mapTransactionForModal(transaction: Transaction | null): any {
  if (!transaction) return null;
  return {
    ...transaction,
    name: 'N/A', // Replace with actual user name if available
    email: 'N/A', // Replace with actual user email if available
    type: transaction.category,
    time: new Date(transaction.date).toLocaleTimeString(),
    reference: `TXN-${transaction.id}`,
    description: transaction.description || '',
  };
}

const TransactionsPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [dateRange] = useState<DateRange>({
    startDate: null,
    endDate: null
  });
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc');
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  // Fetch transactions from API
  const fetchTransactions = async () => {
    setIsLoading(true);
    try {
      const params: any = {
        page: currentPage,
        limit: 10,
        sortBy,
        sortOrder,
      };

      if (filterType !== 'all') {
        params.category = filterType === 'income' ? 'Revenue' : 'Expense';
      }

      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      if (dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate.toISOString();
        params.endDate = dateRange.endDate.toISOString();
      }

      const response = await apiClient.getTransactions(params);
      
      if (response.success) {
        setTransactions(response.data.transactions);
        setTotalPages(response.data.pagination.totalPages);
        setTotalItems(response.data.pagination.totalItems);
      }
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error(error.message || 'Failed to fetch transactions');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, filterType, filterStatus, dateRange, sortBy, sortOrder]);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const params: any = {};
      
      if (filterType !== 'all') {
        params.category = filterType === 'income' ? 'Revenue' : 'Expense';
      }

      if (filterStatus !== 'all') {
        params.status = filterStatus;
      }

      if (dateRange.startDate && dateRange.endDate) {
        params.startDate = dateRange.startDate.toISOString();
        params.endDate = dateRange.endDate.toISOString();
      }

      const blob = await apiClient.exportTransactions(params);
      const filename = `transactions_${new Date().toISOString().split('T')[0]}.csv`;
      downloadCSV(blob, filename);
      toast.success('Transactions exported successfully');
    } catch (error: any) {
      console.error('Export error:', error);
      toast.error(error.message || 'Failed to export transactions');
    } finally {
      setIsExporting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20';
      case 'Failed':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      case 'Cancelled':
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
      default:
        return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toString().includes(searchTerm);
    
    return matchesSearch;
  });

  const totalIncome = filteredTransactions.filter(t => t.category === 'Revenue').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = filteredTransactions.filter(t => t.category === 'Expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);

  return (
    <div className="flex min-h-screen bg-gray-900">
      <Sidebar />
      
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-gray-900 border-b border-gray-800 px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">Transactions</h1>
              <p className="text-gray-400 mt-1">Manage and track all your transactions</p>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleExport}
                disabled={isExporting}
                className="flex items-center space-x-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg transition-colors duration-200"
              >
                {isExporting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                <Download className="h-4 w-4" />
                )}
                <span>{isExporting ? 'Exporting...' : 'Export'}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-8">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Income</p>
                  <p className="text-2xl font-bold text-emerald-400">₹{totalIncome.toFixed(2)}</p>
                </div>
                <div className="bg-emerald-500/10 p-3 rounded-lg">
                  <ArrowUpRight className="h-6 w-6 text-emerald-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Expenses</p>
                  <p className="text-2xl font-bold text-red-400">₹{totalExpenses.toFixed(2)}</p>
                </div>
                <div className="bg-red-500/10 p-3 rounded-lg">
                  <ArrowDownLeft className="h-6 w-6 text-red-400" />
                </div>
              </div>
            </div>

            <div className="bg-gray-800 rounded-lg p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Net Income</p>
                  <p className={`text-2xl font-bold ${totalIncome - totalExpenses >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    ₹{(totalIncome - totalExpenses).toFixed(2)}
                  </p>
                </div>
                <div className="bg-blue-500/10 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-400" />
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-gray-800 rounded-lg p-6 mb-6">
            <div className="flex flex-wrap gap-4 mb-4">
              {/* Search */}
                <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search transactions..."
                    value={searchTerm}
                  onChange={e => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400"
                />
              </div>

              {/* Category Filter */}
              <select
                title="Filter categories"
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Categories</option>
                <option value="income">Income</option>
                <option value="expense">Expenses</option>
              </select>

              {/* Status Filter */}
              <select
                title="Filter"
                value={filterStatus}
                onChange={e => setFilterStatus(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="all">All Statuses</option>
                <option value="Paid">Paid</option>
                <option value="Pending">Pending</option>
                <option value="Failed">Failed</option>
                <option value="Cancelled">Cancelled</option>
              </select>

              {/* Sort By */}
              <select
                title="Sort"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="date">Sort by Date</option>
                <option value="amount">Sort by Amount</option>
                <option value="category">Sort by Category</option>
                <option value="status">Sort by Status</option>
              </select>

              {/* Sort Order */}
              <select
                title="Sorting order"
                value={sortOrder}
                onChange={e => setSortOrder(e.target.value)}
                className="bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
              >
                <option value="desc">Descending</option>
                <option value="asc">Ascending</option>
              </select>
              </div>
          </div>

          {/* Transactions Table */}
          <div className="bg-gray-800 rounded-lg overflow-hidden">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-400" />
                <span className="ml-2 text-gray-400">Loading transactions...</span>
              </div>
            ) : (
              <>
            <div className="overflow-x-auto">
              <table className="w-full">
                    <thead className="bg-gray-700">
                  <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Transaction
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Category
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-700">
                      {filteredTransactions.map((transaction) => (
                        <tr key={transaction.id} className="hover:bg-gray-700/50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full"
                                  src={transaction.user_profile}
                                  alt=""
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-white">
                                  Transaction #{transaction.id}
                                </div>
                                <div className="text-sm text-gray-400">
                                  {transaction.description || 'No description'}
                            </div>
                            </div>
                          </div>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              transaction.category === 'Revenue' 
                                ? 'bg-emerald-100 text-emerald-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {transaction.category}
                            </span>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`text-sm font-medium ${
                              transaction.category === 'Revenue' ? 'text-emerald-400' : 'text-red-400'
                            }`}>
                              {transaction.category === 'Revenue' ? '+' : '-'}₹{Math.abs(transaction.amount).toFixed(2)}
                            </span>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-300">
                            {new Date(transaction.date).toLocaleDateString()}
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getStatusColor(transaction.status)}`}>
                              {transaction.status}
                          </span>
                        </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                              <button
                                className="text-gray-400 hover:text-white"
                                title="View transaction details"
                                onClick={() => { setSelectedTransaction(transaction); setViewModalOpen(true); }}
                              >
                              <Eye className="h-4 w-4" />
                            </button>
                              <button
                                className="text-gray-400 hover:text-white"
                                title="Edit transaction"
                                onClick={() => { setSelectedTransaction(transaction); setEditModalOpen(true); }}
                              >
                              <Edit className="h-4 w-4" />
                            </button>
                              <button
                                className="text-gray-400 hover:text-red-400"
                                title="Delete transaction"
                                onClick={() => { setSelectedTransaction(transaction); setDeleteModalOpen(true); }}
                              >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                      ))}
                </tbody>
              </table>
            </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="bg-gray-700 px-6 py-3 flex items-center justify-between">
                    <div className="text-sm text-gray-400">
                      Showing {((currentPage - 1) * 10) + 1} to {Math.min(currentPage * 10, totalItems)} of {totalItems} results
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-400">
                        Page {currentPage} of {totalPages}
                      </span>
                      <button
                        onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 text-sm bg-gray-600 text-white rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-500"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </main>
      </div>

      {/* Modals */}
      <ViewTransactionModal isOpen={viewModalOpen} onClose={() => setViewModalOpen(false)} transaction={mapTransactionForModal(selectedTransaction)} />
      <EditTransactionModal isOpen={editModalOpen} onClose={() => setEditModalOpen(false)} transaction={mapTransactionForModal(selectedTransaction)} onSave={() => { setEditModalOpen(false); fetchTransactions(); }} />
      <DeleteTransactionModal isOpen={deleteModalOpen} onClose={() => setDeleteModalOpen(false)} transaction={mapTransactionForModal(selectedTransaction)} onDelete={() => { setDeleteModalOpen(false); fetchTransactions(); }} />
    </div>
  );
};

export default TransactionsPage;