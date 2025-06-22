import React, { useMemo } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import type { AmortizationScheduleItem } from '@/lib/amortization';
import { formatCurrency, formatCompactNumber } from '@/lib/formatters';
import { generateCSV, downloadCSV } from '@/lib/exportUtils';

interface AmortizationChartProps {
  schedule: AmortizationScheduleItem[];
  principal: number;
  annualRate: number;
  years: number;
}

interface ChartDataItem {
  period: number;
  principal: number;
  interest: number;
  remaining: number;
}

export const AmortizationChart: React.FC<AmortizationChartProps> = ({
  schedule,
  principal,
  annualRate,
  years,
}) => {
  const chartData: ChartDataItem[] = useMemo(
    () =>
      schedule
        .filter((_, index) => index % 12 === 0 || index === schedule.length - 1)
        .map((item) => ({
          period: item.period,
          principal: Math.round(item.principalPaid),
          interest: Math.round(item.interestPaid),
          remaining: Math.round(item.remainingPrincipal),
        })),
    [schedule]
  );

  const formatTooltipValue = (value: number): string => {
    return formatCurrency(value);
  };

  const formatXAxisTick = (period: number): string => {
    const year = Math.ceil(period / 12);
    return `${year} год`;
  };

  const handleExport = () => {
    const csv = generateCSV(schedule, principal, annualRate, years);
    const date = new Date().toISOString().split('T')[0];
    downloadCSV(csv, `кредитный_калькулятор_${date}.csv`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <div className="flex justify-between items-center mb-3 sm:mb-4">
        <h2
          id="amortization-chart"
          className="text-lg sm:text-xl font-semibold text-gray-800"
        >
          График амортизации кредита
        </h2>
        <button
          onClick={handleExport}
          className="px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center gap-2"
          aria-label="Экспортировать в CSV"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          Экспорт CSV
        </button>
      </div>

      <ResponsiveContainer
        width="100%"
        height={280}
        className="sm:h-[350px] md:h-[400px]"
      >
        <AreaChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
        >
          <defs>
            <linearGradient id="colorPrincipal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorInterest" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#EF4444" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />

          <XAxis
            dataKey="period"
            tickFormatter={formatXAxisTick}
            stroke="#9CA3AF"
            tick={{ fontSize: 12 }}
          />

          <YAxis
            tickFormatter={formatCompactNumber}
            width={50}
            stroke="#9CA3AF"
          />

          <Tooltip
            formatter={formatTooltipValue}
            labelFormatter={(period) => `Месяц ${period}`}
            contentStyle={{
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid #E5E7EB',
              borderRadius: '0.375rem',
            }}
          />

          <Legend
            verticalAlign="top"
            height={36}
            iconType="rect"
            wrapperStyle={{ paddingBottom: '10px', fontSize: '14px' }}
            formatter={(value) => {
              switch (value) {
                case 'principal':
                  return 'Основной долг';
                case 'interest':
                  return 'Проценты';
                case 'remaining':
                  return 'Остаток долга';
                default:
                  return value;
              }
            }}
          />

          <Area
            type="monotone"
            dataKey="principal"
            stackId="1"
            stroke="#3B82F6"
            fillOpacity={1}
            fill="url(#colorPrincipal)"
          />

          <Area
            type="monotone"
            dataKey="interest"
            stackId="1"
            stroke="#EF4444"
            fillOpacity={1}
            fill="url(#colorInterest)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
