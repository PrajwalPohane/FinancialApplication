import React, { useEffect, useRef } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface FinancialChartProps {
  timeRange: 'daily' | 'weekly' | 'monthly';
  chartKey: 'month' | 'day' | 'week';
  data: {
    labels: string[];
    income: number[];
    expenses: number[];
  };
}

const FinancialChart: React.FC<FinancialChartProps> = ({ timeRange, chartKey, data }) => {
  const chartRef = useRef<ChartJS<'line'>>(null);

  const options: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: 'index' as const,
      intersect: false,
    },
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#9CA3AF',
          font: {
            size: 14,
            family: 'Inter, system-ui, sans-serif',
            weight: 500
          },
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 25,
          generateLabels: (chart) => {
            const datasets = chart.data.datasets;
            return datasets.map((dataset, index) => ({
              text: dataset.label || '',
              fillStyle: dataset.borderColor as string,
              strokeStyle: dataset.borderColor as string,
              lineWidth: 3,
              pointStyle: 'circle',
              datasetIndex: index
            }));
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(17, 24, 39, 0.95)',
        titleColor: '#F9FAFB',
        bodyColor: '#F9FAFB',
        borderColor: '#374151',
        borderWidth: 1,
        cornerRadius: 12,
        displayColors: true,
        padding: 12,
        titleFont: {
          size: 14,
          weight: 600
        },
        bodyFont: {
          size: 13,
          weight: 500
        },
        callbacks: {
          title: (context) => {
            const label = context[0].label;
            switch (timeRange) {
              case 'daily':
                return `Day ${label}`;
              case 'weekly':
                return `Week ${label}`;
              case 'monthly':
                return label;
              default:
                return label;
            }
          },
          label: (context) => {
            const label = context.dataset.label || '';
            const value = context.parsed.y;
            return `${label}: ₹${value.toLocaleString()}`;
          },
          afterBody: (context) => {
            if (context.length === 2) {
              const income = context.find(c => c.dataset.label === 'Income')?.parsed.y || 0;
              const expenses = context.find(c => c.dataset.label === 'Expenses')?.parsed.y || 0;
              const net = income - expenses;
              return [``, `Net: ${net >= 0 ? '+' : ''}$${net.toLocaleString()}`];
            }
            return [];
          }
        }
      }
    },
    scales: {
      x: {
        display: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          maxTicksLimit: 10
        },
        title: {
          display: true,
          text:
            chartKey === 'day'
              ? 'Days'
              : chartKey === 'week'
              ? 'Weeks'
              : 'Months',
          color: '#6B7280',
          font: {
            size: 13,
            family: 'Inter, system-ui, sans-serif',
            weight: 500
          },
          padding: 10
        }
      },
      y: {
        display: true,
        grid: {
          color: 'rgba(75, 85, 99, 0.2)',
        },
        ticks: {
          color: '#9CA3AF',
          font: {
            size: 12,
            family: 'Inter, system-ui, sans-serif'
          },
          callback: function(value) {
            return '₹' + Number(value).toLocaleString();
          },
          padding: 8
        },
        title: {
          display: true,
          text: 'Amount (₹)',
          color: '#6B7280',
          font: {
            size: 13,
            family: 'Inter, system-ui, sans-serif',
            weight: 500
          },
          padding: 10
        }
      }
    },
    elements: {
      line: {
        tension: 0.4,
        borderWidth: 3,
      },
      point: {
        radius: 5,
        hoverRadius: 8,
        borderWidth: 2,
        hoverBorderWidth: 3
      }
    }
  };

  const chartData: ChartData<'line'> = {
    labels: data.labels,
    datasets: [
      {
        label: 'Income',
        data: data.income,
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.05)',
        fill: false,
        pointBackgroundColor: '#10B981',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#059669',
        pointHoverBorderColor: '#FFFFFF',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      },
      {
        label: 'Expenses',
        data: data.expenses,
        borderColor: '#F59E0B',
        backgroundColor: 'rgba(245, 158, 11, 0.05)',
        fill: false,
        pointBackgroundColor: '#F59E0B',
        pointBorderColor: '#FFFFFF',
        pointHoverBackgroundColor: '#D97706',
        pointHoverBorderColor: '#FFFFFF',
        tension: 0.4,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 8,
        pointBorderWidth: 2,
        pointHoverBorderWidth: 3,
      }
    ]
  };


  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      // Add smooth animation when data changes
      chart.update('active');
    }
  }, [data, timeRange]);

  return (
    <div className="h-full w-full">
      <Line ref={chartRef} options={options} data={chartData} />
    </div>
  );
};

export default FinancialChart;