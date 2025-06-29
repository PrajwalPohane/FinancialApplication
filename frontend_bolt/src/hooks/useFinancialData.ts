import { useState, useMemo, useEffect } from 'react';
import { apiClient} from '../services/api';

interface DateRange {
  startDate: Date | null;
  endDate: Date | null;
}

interface FinancialData {
  labels: string[];
  income: number[];
  expenses: number[];
}

export const useFinancialData = () => {
  const [timeRange, setTimeRange] = useState<string>('all');
  const [customRange, setCustomRange] = useState<DateRange>({ startDate: null, endDate: null });
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [chartKey, setChartKey] = useState<'month' | 'day' | 'week'>('month');

  const handleTimeRangeChange = (newTimeRange: string, newCustomRange?: DateRange) => {
    setTimeRange(newTimeRange);
    if (newCustomRange) {
      setCustomRange(newCustomRange);
    }
  };

  // Fetch analytics data from API
  useEffect(() => {
    const fetchAnalytics = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const params: any = { timeRange: timeRange as any };
    if (timeRange === 'selectrange' && customRange.startDate && customRange.endDate) {
          params.startDate = customRange.startDate.toISOString();
          params.endDate = customRange.endDate.toISOString();
        }
        
        const response = await apiClient.getAnalytics(params);
        
        setAnalyticsData(response.data);
        setChartKey(response.data.chartKey || 'month');
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Failed to fetch analytics data');
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnalytics();
  }, [timeRange, customRange]);

  const financialData = useMemo((): FinancialData => {
    if (!analyticsData?.chartData) {
    return { labels: [], income: [], expenses: [] };
  }

  const labels: string[] = [];
  const income: number[] = [];
  const expenses: number[] = [];

    analyticsData.chartData.forEach((item: any) => {
      let label = item[chartKey];
      
      if (chartKey === 'month') {
        // Format month label (e.g., "2024-01" -> "Jan 2024")
        const date = new Date(label + '-01');
        label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      } else if (chartKey === 'day') {
        // Format day label (e.g., "2024-01-15" -> "Jan 15")
        const date = new Date(label);
        label = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
      } else if (chartKey === 'week') {
        // Format week label (e.g., "2024-W03" -> "Week 03")
        label = label.replace('W', 'Week ');
      }
      
      labels.push(label);
      income.push(item.revenue || 0);
      expenses.push(item.expenses || 0);
    });

  return { labels, income, expenses };
  }, [analyticsData, chartKey]);

  return {
    timeRange,
    setTimeRange: handleTimeRangeChange,
    customRange,
    data: financialData,
    summary: analyticsData?.summary || null,
    statusBreakdown: analyticsData?.statusBreakdown || {},
    categoryBreakdown: analyticsData?.categoryBreakdown || {},
    isLoading,
    error,
    chartKey
  };
};