import React from 'react';
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

interface AmortizationChartProps {
  schedule: AmortizationScheduleItem[];
}

interface ChartDataItem {
  period: number;
  principal: number;
  interest: number;
  remaining: number;
}

export const AmortizationChart: React.FC<AmortizationChartProps> = ({
  schedule,
}) => {
  const chartData: ChartDataItem[] = schedule
    .filter((_, index) => index % 12 === 0 || index === schedule.length - 1)
    .map((item) => ({
      period: item.period,
      principal: Math.round(item.principalPaid),
      interest: Math.round(item.interestPaid),
      remaining: Math.round(item.remainingPrincipal),
    }));

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatTooltipValue = (value: number): string => {
    return formatCurrency(value);
  };

  const formatXAxisTick = (period: number): string => {
    const year = Math.ceil(period / 12);
    return `${year} год`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-3 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
        График амортизации кредита
      </h2>

      <ResponsiveContainer width="100%" height={280} className="sm:h-[350px] md:h-[400px]">
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
            tickFormatter={(value) => `${(value / 1000).toFixed(0)}к`}
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
