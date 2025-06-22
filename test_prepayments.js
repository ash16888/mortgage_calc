// Тест функций досрочных погашений
import { 
  generateAmortizationSchedule,
  calculateTotalInterestWithPrepayments,
  calculateMonthlyPayment,
  calculateTotalInterest 
} from './src/lib/amortization.js';

// Тестовые параметры кредита
const principal = 5000000; // 5 млн рублей
const annualRate = 12; // 12%
const years = 15; // 15 лет

console.log('=== ТЕСТИРОВАНИЕ ДОСРОЧНЫХ ПОГАШЕНИЙ ===\n');

// Базовый расчет без досрочных погашений
const baseMonthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
const baseTotalInterest = calculateTotalInterest(principal, annualRate, years);

console.log('Базовые параметры кредита:');
console.log(`Сумма: ${principal.toLocaleString('ru-RU')} ₽`);
console.log(`Ставка: ${annualRate}%`);
console.log(`Срок: ${years} лет`);
console.log(`Ежемесячный платеж: ${Math.round(baseMonthlyPayment).toLocaleString('ru-RU')} ₽`);
console.log(`Переплата: ${Math.round(baseTotalInterest).toLocaleString('ru-RU')} ₽\n`);

// Тест 1: Разовое досрочное погашение 500,000 ₽ в 12-м месяце
console.log('ТЕСТ 1: Разовое досрочное погашение 500,000 ₽ в 12-м месяце (уменьшение срока)');
const prepayment1 = [{
  type: 'oneTime',
  amount: 500000,
  startMonth: 12,
  reduceType: 'term'
}];

const schedule1 = generateAmortizationSchedule(principal, annualRate, years, prepayment1);
const totalInterest1 = calculateTotalInterestWithPrepayments(principal, annualRate, years, prepayment1);
const savings1 = baseTotalInterest - totalInterest1;
const newTerm1 = schedule1.length;

console.log(`Новый срок: ${Math.ceil(newTerm1 / 12)} лет ${newTerm1 % 12} месяцев`);
console.log(`Переплата с досрочным погашением: ${Math.round(totalInterest1).toLocaleString('ru-RU')} ₽`);
console.log(`Экономия: ${Math.round(savings1).toLocaleString('ru-RU')} ₽\n`);

// Тест 2: Ежемесячное досрочное погашение 10,000 ₽
console.log('ТЕСТ 2: Ежемесячное досрочное погашение 10,000 ₽ (уменьшение срока)');
const prepayment2 = [{
  type: 'monthly',
  amount: 10000,
  reduceType: 'term'
}];

const schedule2 = generateAmortizationSchedule(principal, annualRate, years, prepayment2);
const totalInterest2 = calculateTotalInterestWithPrepayments(principal, annualRate, years, prepayment2);
const savings2 = baseTotalInterest - totalInterest2;
const newTerm2 = schedule2.length;

console.log(`Новый срок: ${Math.ceil(newTerm2 / 12)} лет ${newTerm2 % 12} месяцев`);
console.log(`Переплата с досрочным погашением: ${Math.round(totalInterest2).toLocaleString('ru-RU')} ₽`);
console.log(`Экономия: ${Math.round(savings2).toLocaleStrategy('ru-RU')} ₽\n`);

// Тест 3: Комбинированное досрочное погашение
console.log('ТЕСТ 3: Комбинированное - разовое 300,000 ₽ в 6-м месяце + ежемесячное 5,000 ₽');
const prepayment3 = [
  {
    type: 'oneTime',
    amount: 300000,
    startMonth: 6,
    reduceType: 'term'
  },
  {
    type: 'monthly',
    amount: 5000,
    reduceType: 'term'
  }
];

const schedule3 = generateAmortizationSchedule(principal, annualRate, years, prepayment3);
const totalInterest3 = calculateTotalInterestWithPrepayments(principal, annualRate, years, prepayment3);
const savings3 = baseTotalInterest - totalInterest3;
const newTerm3 = schedule3.length;

console.log(`Новый срок: ${Math.ceil(newTerm3 / 12)} лет ${newTerm3 % 12} месяцев`);
console.log(`Переплата с досрочным погашением: ${Math.round(totalInterest3).toLocaleString('ru-RU')} ₽`);
console.log(`Экономия: ${Math.round(savings3).toLocaleString('ru-RU')} ₽\n`);

console.log('=== ТЕСТИРОВАНИЕ ЗАВЕРШЕНО ===');