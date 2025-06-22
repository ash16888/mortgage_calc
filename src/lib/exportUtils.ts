import type { AmortizationScheduleItem } from './amortization';
import { formatNumber } from './formatters';

export function generateCSV(
  schedule: AmortizationScheduleItem[],
  principal: number,
  annualRate: number,
  years: number
): string {
  const headers = [
    'Месяц',
    'Основной долг',
    'Проценты',
    'Досрочное погашение',
    'Общий платеж',
    'Остаток долга',
  ];

  const rows = schedule.map((item) => [
    item.period,
    formatNumber(Math.round(item.principalPaid)),
    formatNumber(Math.round(item.interestPaid)),
    item.prepayment ? formatNumber(Math.round(item.prepayment)) : '0',
    formatNumber(
      Math.round(item.totalPayment || item.principalPaid + item.interestPaid)
    ),
    formatNumber(Math.round(item.remainingPrincipal)),
  ]);

  // Add summary row
  const totalPrincipal = schedule.reduce(
    (sum, item) => sum + item.principalPaid,
    0
  );
  const totalInterest = schedule.reduce(
    (sum, item) => sum + item.interestPaid,
    0
  );
  const totalPrepayments = schedule.reduce(
    (sum, item) => sum + (item.prepayment || 0),
    0
  );

  rows.push([]);
  rows.push([
    'Итого',
    formatNumber(Math.round(totalPrincipal)),
    formatNumber(Math.round(totalInterest)),
    formatNumber(Math.round(totalPrepayments)),
    '',
    '',
  ]);

  // Add loan parameters
  rows.push([]);
  rows.push(['Параметры кредита']);
  rows.push(['Сумма кредита', formatNumber(principal)]);
  rows.push(['Процентная ставка', `${annualRate}%`]);
  rows.push(['Срок кредита', `${years} лет`]);

  // Convert to CSV format
  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  return csvContent;
}

export function downloadCSV(
  csvContent: string,
  filename: string = 'amortization_schedule.csv'
): void {
  const BOM = '\uFEFF';
  const blob = new Blob([BOM + csvContent], {
    type: 'text/csv;charset=utf-8;',
  });
  const link = document.createElement('a');

  // Type assertion for IE compatibility
  const nav = navigator as any;
  if (nav.msSaveBlob) {
    // IE 10+
    nav.msSaveBlob(blob, filename);
  } else {
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
