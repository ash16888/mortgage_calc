import { describe, it, expect } from 'vitest';
import {
  generateAmortizationSchedule,
  calculateTotalInterestWithPrepayments,
  calculateMonthlyPayment,
  calculateTotalInterest,
  type Prepayment,
} from './amortization';

describe('Dosrochnie pogasheniya (Prepayments)', () => {
  const principal = 5000000; // 5 млн рублей
  const annualRate = 12; // 12%
  const years = 15; // 15 лет

  const baseMonthlyPayment = calculateMonthlyPayment(
    principal,
    annualRate,
    years
  );
  const baseTotalInterest = calculateTotalInterest(
    principal,
    annualRate,
    years
  );

  it('should calculate base loan correctly', () => {
    expect(Math.round(baseMonthlyPayment)).toBeCloseTo(60008, 0);
    expect(Math.round(baseTotalInterest)).toBeCloseTo(5801513, 0);
  });

  it('should handle one-time prepayment with term reduction', () => {
    const prepayments: Prepayment[] = [
      {
        type: 'oneTime',
        amount: 500000,
        startMonth: 12,
        reduceType: 'term',
      },
    ];

    const schedule = generateAmortizationSchedule(
      principal,
      annualRate,
      years,
      prepayments
    );
    const totalInterest = calculateTotalInterestWithPrepayments(
      principal,
      annualRate,
      years,
      prepayments
    );

    // Проверяем, что срок кредита сократился
    expect(schedule.length).toBeLessThan(years * 12);

    // Проверяем, что переплата уменьшилась
    expect(totalInterest).toBeLessThan(baseTotalInterest);

    // Проверяем, что досрочное погашение отражено в графике
    const month12 = schedule.find((item) => item.period === 12);
    expect(month12?.prepayment).toBe(500000);
  });

  it('should handle monthly prepayment with term reduction', () => {
    const prepayments: Prepayment[] = [
      {
        type: 'monthly',
        amount: 10000,
        reduceType: 'term',
      },
    ];

    const schedule = generateAmortizationSchedule(
      principal,
      annualRate,
      years,
      prepayments
    );
    const totalInterest = calculateTotalInterestWithPrepayments(
      principal,
      annualRate,
      years,
      prepayments
    );

    // Проверяем, что срок кредита значительно сократился
    expect(schedule.length).toBeLessThan(years * 12 * 0.8); // менее 80% от изначального срока

    // Проверяем, что переплата существенно уменьшилась
    expect(totalInterest).toBeLessThan(baseTotalInterest * 0.7); // менее 70% от изначальной переплаты

    // Проверяем, что ежемесячные досрочные погашения отражены
    const monthWithPrepayment = schedule.find(
      (item) => item.prepayment === 10000
    );
    expect(monthWithPrepayment).toBeDefined();
  });

  it('should handle combined prepayments', () => {
    const prepayments: Prepayment[] = [
      {
        type: 'oneTime',
        amount: 300000,
        startMonth: 6,
        reduceType: 'term',
      },
      {
        type: 'monthly',
        amount: 5000,
        reduceType: 'term',
      },
    ];

    const schedule = generateAmortizationSchedule(
      principal,
      annualRate,
      years,
      prepayments
    );
    const totalInterest = calculateTotalInterestWithPrepayments(
      principal,
      annualRate,
      years,
      prepayments
    );

    // Проверяем, что срок кредита сократился
    expect(schedule.length).toBeLessThan(years * 12);

    // Проверяем, что переплата уменьшилась
    expect(totalInterest).toBeLessThan(baseTotalInterest);

    // Проверяем разовое досрочное погашение в 6-м месяце
    const month6 = schedule.find((item) => item.period === 6);
    expect(month6?.prepayment).toBe(305000); // 300000 разовое + 5000 ежемесячное
  });

  it('should handle prepayment with payment reduction', () => {
    const prepayments: Prepayment[] = [
      {
        type: 'monthly',
        amount: 10000,
        reduceType: 'payment',
      },
    ];

    const schedule = generateAmortizationSchedule(
      principal,
      annualRate,
      years,
      prepayments
    );
    const totalInterest = calculateTotalInterestWithPrepayments(
      principal,
      annualRate,
      years,
      prepayments
    );

    // При уменьшении платежа срок может сократиться из-за досрочных платежей
    expect(schedule.length).toBeLessThanOrEqual(years * 12);

    // Но переплата все равно уменьшается
    expect(totalInterest).toBeLessThan(baseTotalInterest);

    // Проверяем, что размер обычного платежа уменьшился после первого досрочного погашения
    const laterMonths = schedule.slice(2, 5);
    const reducedPayment = laterMonths[0].totalPayment! - 10000; // минус досрочное погашение
    expect(reducedPayment).toBeLessThan(baseMonthlyPayment);
  });

  it('should not allow overpayment', () => {
    const prepayments: Prepayment[] = [
      {
        type: 'oneTime',
        amount: 10000000, // больше чем остаток долга
        startMonth: 1,
        reduceType: 'term',
      },
    ];

    const schedule = generateAmortizationSchedule(
      principal,
      annualRate,
      years,
      prepayments
    );

    // Кредит должен быть погашен в первом месяце
    expect(schedule.length).toBe(1);
    expect(schedule[0].remainingPrincipal).toBe(0);
  });

  it('should calculate correct savings', () => {
    const prepayments: Prepayment[] = [
      {
        type: 'monthly',
        amount: 10000,
        reduceType: 'term',
      },
    ];

    const totalInterestWithPrepayments = calculateTotalInterestWithPrepayments(
      principal,
      annualRate,
      years,
      prepayments
    );

    const savings = baseTotalInterest - totalInterestWithPrepayments;

    // Экономия должна быть значительной
    expect(savings).toBeGreaterThan(1000000); // более 1 млн рублей экономии
  });
});
