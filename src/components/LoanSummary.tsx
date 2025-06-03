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
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Результаты расчёта
      </h2>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Ежемесячный платёж</p>
          <p className="text-xl lg:text-2xl font-bold text-blue-600">
            {formatCurrency(monthlyPayment)}
          </p>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Переплата по процентам</p>
          <p className="text-xl lg:text-2xl font-bold text-green-600">
            {formatCurrency(totalInterest)}
          </p>
        </div>

        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-sm text-gray-600 mb-1">Общая сумма выплат</p>
          <p className="text-xl lg:text-2xl font-bold text-purple-600">
            {formatCurrency(totalAmount)}
          </p>
        </div>
      </div>
    </div>
  );
};
