import React from 'react';

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

  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('ru-RU', {
      style: 'currency',
      currency: 'RUB',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6 mb-4 sm:mb-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">
        Результаты расчёта
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-blue-50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Ежемесячный платёж</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-600">
            {formatCurrency(monthlyPayment)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-3 sm:p-4">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Переплата по процентам</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-green-600">
            {formatCurrency(totalInterest)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-3 sm:p-4 sm:col-span-2 lg:col-span-1">
          <p className="text-xs sm:text-sm text-gray-600 mb-1">Общая сумма выплат</p>
          <p className="text-lg sm:text-xl lg:text-2xl font-bold text-purple-600">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};
