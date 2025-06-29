import Transaction from '../models/Transaction';
import { createObjectCsvWriter } from 'csv-writer';
import moment from 'moment';
import fs from 'fs';
import path from 'path';

// Get all transactions for a user
const getTransactions = async (req: any, res: any) => {
  try {
    const { page = 1, limit = 10, category, status, startDate, endDate, sortBy = 'date', sortOrder = 'desc' } = req.query;
    const user_id = req.user.user_id;

    const query: { [key: string]: any } = { user_id };
    if (category) query.category = category;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const transactions = await Transaction.find(query)
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    // Get total count for pagination
    const total = await Transaction.countDocuments(query);

    res.json({
      success: true,
      data: {
        transactions,
        pagination: {
          currentPage: parseInt(page),
          totalPages: Math.ceil(total / limit),
          totalItems: total,
          itemsPerPage: parseInt(limit)
        }
      }
    });
  } catch (error) {
    console.error('Get transactions error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transactions'
    });
  }
};

// Get single transaction
const getTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const transaction = await Transaction.findOne({ id: parseInt(id), user_id: userId });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      data: { transaction }
    });
  } catch (error) {
    console.error('Get transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching transaction'
    });
  }
};

// Create new transaction
const createTransaction = async (req, res) => {
  try {
    const { amount, category, status, description } = req.body;
    const userId = req.user.user_id;

    // Get the next ID
    const lastTransaction = await Transaction.findOne().sort({ id: -1 });
    const nextId = lastTransaction ? lastTransaction.id + 1 : 1;

    const transaction = new Transaction({
      id: nextId,
      amount,
      category,
      status,
      user_id: userId,
      description,
      user_profile: 'https://thispersondoesnotexist.com/'
    });

    await transaction.save();

    res.status(201).json({
      success: true,
      message: 'Transaction created successfully',
      data: { transaction }
    });
  } catch (error) {
    console.error('Create transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating transaction'
    });
  }
};

// Update transaction
const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, category, status, description, date } = req.body;
    const userId = req.user.user_id;

    const transaction = await Transaction.findOne({ id: parseInt(id), user_id: userId });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    // Update fields
    if (amount !== undefined) transaction.amount = amount;
    if (category) transaction.category = category;
    if (status) transaction.status = status;
    if (date) transaction.date = date;

    await transaction.save();

    res.json({
      success: true,
      message: 'Transaction updated successfully',
      data: { transaction }
    });
  } catch (error) {
    console.error('Update transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating transaction'
    });
  }
};

// Delete transaction
const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.user_id;

    const transaction = await Transaction.findOneAndDelete({ id: parseInt(id), user_id: userId });
    
    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    res.json({
      success: true,
      message: 'Transaction deleted successfully'
    });
  } catch (error) {
    console.error('Delete transaction error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting transaction'
    });
  }
};

// Get financial analytics
const getAnalytics = async (req: any, res: any) => {
  try {
    const { timeRange = 'last30days', startDate, endDate, category, status } = req.query;
    const user_id = req.user.user_id;
    const query: Record<string, any> = { user_id };
    
    if (category) query.category = category;
    if (status) query.status = status;

    // Add date filtering based on timeRange
    if (timeRange === 'all') {
      // No date filter, include all transactions
    } else if (timeRange === 'monthly') {
      // No date filter for monthly - we want all transactions to show full range
    } else if (timeRange === 'last30days') {
      // Last 30 days
      const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
      query.date = { $gte: thirtyDaysAgo };
    } else if (startDate || endDate) {
      // Custom range
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    // Get transactions for the period
    const transactions = await Transaction.find(query).lean();

    // Calculate analytics
    const totalRevenue = transactions
      .filter(t => t.category === 'Revenue')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.category === 'Expense')
      .reduce((sum, t) => sum + Math.abs(t.amount), 0);

    const netIncome = totalRevenue - totalExpenses;

    // Status breakdown
    const statusBreakdown = transactions.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});

    // Category breakdown
    const categoryBreakdown = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    // Dynamic aggregation for chart
    let chartData = {};
    let key = 'month';
    
    if (timeRange === 'all') {
      key = 'day';
      
      // For "All Transactions", show each transaction as a point
      transactions.forEach(t => {
        const day = moment(t.date).format('YYYY-MM-DD');
        if (!chartData[day]) chartData[day] = { revenue: 0, expenses: 0 };
        if (t.category === 'Revenue') {
          chartData[day].revenue += t.amount;
        } else {
          chartData[day].expenses += Math.abs(t.amount);
        }
      });
    } else if (timeRange === 'monthly') {
      key = 'month';
      
      // Get the date range of all transactions
      const dates = transactions.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1];
      
      if (firstDate && lastDate) {
        // Generate all months between first and last transaction
        const currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
        const endDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0);
        
        while (currentDate <= endDate) {
          const monthKey = moment(currentDate).format('YYYY-MM');
          chartData[monthKey] = { revenue: 0, expenses: 0 };
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        
        // Now aggregate transaction data into the generated months
        transactions.forEach(t => {
          const month = moment(t.date).format('YYYY-MM');
          if (chartData[month]) {
            if (t.category === 'Revenue') {
              chartData[month].revenue += t.amount;
            } else {
              chartData[month].expenses += Math.abs(t.amount);
            }
          }
        });
      }
    } else if (timeRange === 'last30days') {
      key = 'day';
      transactions.forEach(t => {
        const day = moment(t.date).format('YYYY-MM-DD');
        if (!chartData[day]) chartData[day] = { revenue: 0, expenses: 0 };
        if (t.category === 'Revenue') {
          chartData[day].revenue += t.amount;
        } else {
          chartData[day].expenses += Math.abs(t.amount);
        }
      });
    } else {
      key = 'week';
      transactions.forEach(t => {
        const week = moment(t.date).format('YYYY-[W]WW');
        if (!chartData[week]) chartData[week] = { revenue: 0, expenses: 0 };
        if (t.category === 'Revenue') {
          chartData[week].revenue += t.amount;
        } else {
          chartData[week].expenses += Math.abs(t.amount);
        }
      });
    }

    // Convert to array and sort by date
    const chartDataArray = Object.entries(chartData)
      .map(([k, data]) => ({ [key]: k, ...(data as object) }))
      .sort((a, b) => {
        const aKey = a[key];
        const bKey = b[key];
        return aKey.localeCompare(bKey);
      });

    res.json({
      success: true,
      data: {
        summary: {
          totalRevenue,
          totalExpenses,
          netIncome,
          transactionCount: transactions.length
        },
        statusBreakdown,
        categoryBreakdown,
        chartKey: key,
        chartData: chartDataArray
      }
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching analytics'
    });
  }
};

// Export transactions to CSV
const exportToCSV = async (req, res) => {
  try {
    const { category, status, startDate, endDate } = req.query;
    const userId = req.user.user_id;

    // Build query
    let query: { [key: string]: any } = { user_id: userId };
    
    if (category) query.category = category;
    if (status) query.status = status;
    
    if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).sort({ date: -1 }).lean();

    if (transactions.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No transactions found for export'
      });
    }

    // Create CSV file
    const fileName = `transactions_${userId}_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../temp', fileName);

    // Ensure temp directory exists
    const tempDir = path.dirname(filePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    const csvWriter = createObjectCsvWriter({
      path: filePath,
      header: [
        { id: 'id', title: 'ID' },
        { id: 'date', title: 'Date' },
        { id: 'amount', title: 'Amount' },
        { id: 'category', title: 'Category' },
        { id: 'status', title: 'Status' },
        { id: 'description', title: 'Description' }
      ]
    });

    // Format data for CSV
    const csvData = transactions.map(t => ({
      id: t.id,
      date: moment(t.date).format('YYYY-MM-DD HH:mm:ss'),
      amount: t.amount,
      category: t.category,
      status: t.status,
      description: t.description || ''
    }));

    await csvWriter.writeRecords(csvData);

    // Send file
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      // Clean up file after download
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Export CSV error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting CSV'
    });
  }
};

// Export analytics report to CSV
const exportAnalyticsReport = async (req, res) => {
  try {
    const { timeRange = 'last30days', startDate, endDate, category, status } = req.query;
    const user_id = req.user.user_id;
    const query: Record<string, any> = { user_id };
    if (category) query.category = category;
    if (status) query.status = status;
    if (timeRange === 'all') {
      // No date filter
    } else if (timeRange === 'monthly') {
      // No date filter for monthly
    } else if (timeRange === 'last30days') {
      const thirtyDaysAgo = moment().subtract(30, 'days').startOf('day').toDate();
      query.date = { $gte: thirtyDaysAgo };
    } else if (startDate || endDate) {
      query.date = {};
      if (startDate) query.date.$gte = new Date(startDate);
      if (endDate) query.date.$lte = new Date(endDate);
    }

    const transactions = await Transaction.find(query).lean();

    // Calculate analytics
    const totalRevenue = transactions.filter(t => t.category === 'Revenue').reduce((sum, t) => sum + t.amount, 0);
    const totalExpenses = transactions.filter(t => t.category === 'Expense').reduce((sum, t) => sum + Math.abs(t.amount), 0);
    const netIncome = totalRevenue - totalExpenses;
    const statusBreakdown = transactions.reduce((acc, t) => {
      acc[t.status] = (acc[t.status] || 0) + 1;
      return acc;
    }, {});
    const categoryBreakdown = transactions.reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + 1;
      return acc;
    }, {});

    // Dynamic aggregation for chart
    let chartData = {};
    let key = 'month';
    if (timeRange === 'all') {
      key = 'day';
      transactions.forEach(t => {
        const day = moment(t.date).format('YYYY-MM-DD');
        if (!chartData[day]) chartData[day] = { revenue: 0, expenses: 0 };
        if (t.category === 'Revenue') {
          chartData[day].revenue += t.amount;
        } else {
          chartData[day].expenses += Math.abs(t.amount);
        }
      });
    } else if (timeRange === 'monthly') {
      key = 'month';
      const dates = transactions.map(t => new Date(t.date)).sort((a, b) => a.getTime() - b.getTime());
      const firstDate = dates[0];
      const lastDate = dates[dates.length - 1];
      if (firstDate && lastDate) {
        const currentDate = new Date(firstDate.getFullYear(), firstDate.getMonth(), 1);
        const endDate = new Date(lastDate.getFullYear(), lastDate.getMonth() + 1, 0);
        while (currentDate <= endDate) {
          const monthKey = moment(currentDate).format('YYYY-MM');
          chartData[monthKey] = { revenue: 0, expenses: 0 };
          currentDate.setMonth(currentDate.getMonth() + 1);
        }
        transactions.forEach(t => {
          const month = moment(t.date).format('YYYY-MM');
          if (chartData[month]) {
            if (t.category === 'Revenue') {
              chartData[month].revenue += t.amount;
            } else {
              chartData[month].expenses += Math.abs(t.amount);
            }
          }
        });
      }
    } else if (timeRange === 'last30days') {
      key = 'day';
      transactions.forEach(t => {
        const day = moment(t.date).format('YYYY-MM-DD');
        if (!chartData[day]) chartData[day] = { revenue: 0, expenses: 0 };
        if (t.category === 'Revenue') {
          chartData[day].revenue += t.amount;
        } else {
          chartData[day].expenses += Math.abs(t.amount);
        }
      });
    } else {
      key = 'week';
      transactions.forEach(t => {
        const week = moment(t.date).format('YYYY-[W]WW');
        if (!chartData[week]) chartData[week] = { revenue: 0, expenses: 0 };
        if (t.category === 'Revenue') {
          chartData[week].revenue += t.amount;
        } else {
          chartData[week].expenses += Math.abs(t.amount);
        }
      });
    }
    const chartDataArray = Object.entries(chartData)
      .map(([k, data]) => ({ [key]: k, ...(data as object) }))
      .sort((a, b) => {
        const aKey = a[key];
        const bKey = b[key];
        return aKey.localeCompare(bKey);
      });

    // Prepare CSV content
    const fileName = `analytics_report_${user_id}_${Date.now()}.csv`;
    const filePath = path.join(__dirname, '../temp', fileName);
    const tempDir = path.dirname(filePath);
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    // Write summary
    let csvContent = 'Summary\n';
    csvContent += `Total Revenue,${totalRevenue}\n`;
    csvContent += `Total Expenses,${totalExpenses}\n`;
    csvContent += `Net Income,${netIncome}\n`;
    csvContent += `Transaction Count,${transactions.length}\n\n`;

    // Write status breakdown
    csvContent += 'Status Breakdown\n';
    Object.entries(statusBreakdown).forEach(([status, count]) => {
      csvContent += `${status},${count}\n`;
    });
    csvContent += '\n';

    // Write category breakdown
    csvContent += 'Category Breakdown\n';
    Object.entries(categoryBreakdown).forEach(([cat, count]) => {
      csvContent += `${cat},${count}\n`;
    });
    csvContent += '\n';

    // Write chart data
    csvContent += 'Chart Data\n';
    csvContent += `${key},Revenue,Expenses\n`;
    chartDataArray.forEach(row => {
      csvContent += `${row[key]},${row.revenue},${row.expenses}\n`;
    });

    // Write to file
    fs.writeFileSync(filePath, csvContent);

    // Send file
    res.download(filePath, fileName, (err) => {
      if (err) {
        console.error('Download error:', err);
      }
      fs.unlink(filePath, (unlinkErr) => {
        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
      });
    });
  } catch (error) {
    console.error('Export analytics report error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while exporting analytics report'
    });
  }
};

export default {
  getTransactions,
  getTransaction,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getAnalytics,
  exportToCSV,
  exportAnalyticsReport
}; 