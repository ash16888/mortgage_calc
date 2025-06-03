export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('ru-RU').format(value);
};

export const formatCompactNumber = (value: number): string => {
  return `${(value / 1000).toFixed(0)}к`;
};
