import React, { useState } from 'react';
import { formatNumber } from '@/lib/formatters';
import type { Prepayment } from '@/lib/amortization';

interface PrepaymentInputProps {
  prepayments: Prepayment[];
  onPrepaymentsChange: (prepayments: Prepayment[]) => void;
  maxMonths: number;
}

export const PrepaymentInput: React.FC<PrepaymentInputProps> = ({
  prepayments,
  onPrepaymentsChange,
  maxMonths,
}) => {
  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState<'oneTime' | 'monthly'>('oneTime');
  const [amount, setAmount] = useState('');
  const [startMonth, setStartMonth] = useState('1');
  const [reduceType, setReduceType] = useState<'term' | 'payment'>('term');

  const handleAdd = () => {
    if (!amount || parseFloat(amount) <= 0) return;

    const newPrepayment: Prepayment = {
      type,
      amount: parseFloat(amount),
      startMonth: type === 'oneTime' ? parseInt(startMonth) : undefined,
      reduceType,
    };

    if (type === 'monthly') {
      // Remove existing monthly prepayment
      const filtered = prepayments.filter((p) => p.type !== 'monthly');
      onPrepaymentsChange([...filtered, newPrepayment]);
    } else {
      onPrepaymentsChange([...prepayments, newPrepayment]);
    }

    setAmount('');
    setStartMonth('1');
    setShowForm(false);
  };

  const handleRemove = (index: number) => {
    const updated = prepayments.filter((_, i) => i !== index);
    onPrepaymentsChange(updated);
  };

  const monthlyPrepayment = prepayments.find((p) => p.type === 'monthly');
  const oneTimePrepayments = prepayments.filter((p) => p.type === 'oneTime');

  return (
    <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
        Досрочные погашения
      </h2>

      {monthlyPrepayment && (
        <div className="mb-4 p-3 bg-blue-50 rounded-md">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Ежемесячное досрочное погашение
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {formatNumber(monthlyPrepayment.amount)} ₽
              </p>
              <p className="text-xs text-gray-600">
                Уменьшение{' '}
                {monthlyPrepayment.reduceType === 'term' ? 'срока' : 'платежа'}
              </p>
            </div>
            <button
              onClick={() =>
                handleRemove(prepayments.indexOf(monthlyPrepayment))
              }
              className="text-red-600 hover:text-red-800 text-sm"
              aria-label="Удалить ежемесячное досрочное погашение"
            >
              Удалить
            </button>
          </div>
        </div>
      )}

      {oneTimePrepayments.length > 0 && (
        <div className="mb-4 space-y-2">
          <p className="text-sm font-medium text-gray-700 mb-2">
            Разовые досрочные погашения:
          </p>
          {oneTimePrepayments.map((prepayment, index) => (
            <div
              key={index}
              className="flex justify-between items-center p-2 bg-gray-50 rounded"
            >
              <div>
                <span className="text-sm text-gray-900">
                  {formatNumber(prepayment.amount)} ₽ в месяце{' '}
                  {prepayment.startMonth}
                </span>
                <span className="text-xs text-gray-600 ml-2">
                  (
                  {prepayment.reduceType === 'term'
                    ? 'уменьшение срока'
                    : 'уменьшение платежа'}
                  )
                </span>
              </div>
              <button
                onClick={() => handleRemove(prepayments.indexOf(prepayment))}
                className="text-red-600 hover:text-red-800 text-sm"
                aria-label={`Удалить досрочное погашение ${index + 1}`}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {!showForm ? (
        <button
          onClick={() => setShowForm(true)}
          className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Добавить досрочное погашение
        </button>
      ) : (
        <div className="space-y-4 border-t pt-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Тип погашения
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="oneTime"
                  checked={type === 'oneTime'}
                  onChange={(e) => setType(e.target.value as 'oneTime')}
                  className="mr-2"
                />
                Разовое
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="monthly"
                  checked={type === 'monthly'}
                  onChange={(e) => setType(e.target.value as 'monthly')}
                  className="mr-2"
                  disabled={!!monthlyPrepayment}
                />
                Ежемесячное
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Сумма досрочного погашения (₽)
            </label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="100000"
            />
          </div>

          {type === 'oneTime' && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Месяц погашения
              </label>
              <input
                type="number"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                min="1"
                max={maxMonths}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Что уменьшать
            </label>
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  value="term"
                  checked={reduceType === 'term'}
                  onChange={(e) => setReduceType(e.target.value as 'term')}
                  className="mr-2"
                />
                Срок кредита
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  value="payment"
                  checked={reduceType === 'payment'}
                  onChange={(e) => setReduceType(e.target.value as 'payment')}
                  className="mr-2"
                />
                Размер платежа
              </label>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleAdd}
              className="flex-1 py-2 px-4 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Добавить
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setAmount('');
                setStartMonth('1');
              }}
              className="flex-1 py-2 px-4 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors"
            >
              Отмена
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
