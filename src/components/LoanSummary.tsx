import React from 'react';
import { formatCurrency } from '@/lib/formatters';

interface LoanSummaryProps {
  monthlyPayment: number;
  totalInterest: number;
  principal: number;
}

export const LoanSummary: React.FC<LoanSummaryProps> = ({
  monthlyPayment,
  totalInterest,
  principal,
}) => {
  const totalAmount = principal + totalInterest;

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <h2
        id="loan-results"
        className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4"
      >
        Результаты расчёта
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4 min-w-0 overflow-hidden">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            Ежемесячный платёж
          </p>
          <div className="overflow-hidden">
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-blue-600 whitespace-nowrap currency-large">
              {formatCurrency(monthlyPayment)}
            </p>
          </div>
        </div>

        <div className="bg-green-50 rounded-lg p-3 sm:p-4 min-w-0 overflow-hidden">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            Переплата по процентам
          </p>
          <div className="overflow-hidden">
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-green-600 whitespace-nowrap currency-extra-large">
              {formatCurrency(totalInterest)}
            </p>
          </div>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1 min-w-0 overflow-hidden">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">
            Общая сумма выплат
          </p>
          <div className="overflow-hidden">
            <p className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-purple-600 whitespace-nowrap currency-extra-large">
              {formatCurrency(totalAmount)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
