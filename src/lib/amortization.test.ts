import { describe, it, expect } from 'vitest';
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  generateAmortizationSchedule,
} from './amortization';

describe('calculateMonthlyPayment', () => {
  it('should calculate correct monthly payment for standard loan', () => {
    const payment = calculateMonthlyPayment(1000000, 12, 5);
    expect(payment).toBeCloseTo(22244.45, 2);
  });

  it('should handle zero interest rate', () => {
    const payment = calculateMonthlyPayment(1200000, 0, 10);
    expect(payment).toBe(10000);
  });

  it('should handle very small loans', () => {
    const payment = calculateMonthlyPayment(100000, 10, 1);
    expect(payment).toBeCloseTo(8791.59, 2);
  });

  it('should handle very large loans', () => {
    const payment = calculateMonthlyPayment(30000000, 15, 20);
    expect(payment).toBeCloseTo(395036.87, 2);
  });
});

describe('calculateTotalInterest', () => {
  it('should calculate correct total interest', () => {
    const interest = calculateTotalInterest(1000000, 12, 5);
    expect(interest).toBeCloseTo(334667, 0);
  });

  it('should return zero for zero interest rate', () => {
    const interest = calculateTotalInterest(1000000, 0, 5);
    expect(interest).toBeCloseTo(0, 5);
  });

  it('should handle high interest rates', () => {
    const interest = calculateTotalInterest(500000, 25, 3);
    expect(interest).toBeCloseTo(215676.87, 2);
  });
});

describe('generateAmortizationSchedule', () => {
  it('should generate correct schedule length', () => {
    const schedule = generateAmortizationSchedule(1000000, 12, 5);
    expect(schedule).toHaveLength(60);
  });

  it('should have decreasing remaining principal', () => {
    const schedule = generateAmortizationSchedule(1000000, 12, 5);
    for (let i = 1; i < schedule.length; i++) {
      expect(schedule[i].remainingPrincipal).toBeLessThan(
        schedule[i - 1].remainingPrincipal
      );
    }
  });

  it('should have nearly zero remaining principal at the end', () => {
    const schedule = generateAmortizationSchedule(1000000, 12, 5);
    const lastPayment = schedule[schedule.length - 1];
    expect(lastPayment.remainingPrincipal).toBeCloseTo(0, 0);
  });

  it('should have correct first payment breakdown', () => {
    const schedule = generateAmortizationSchedule(1000000, 10, 1);
    const firstPayment = schedule[0];

    expect(firstPayment.period).toBe(1);
    expect(firstPayment.interestPaid).toBeCloseTo(8333.33, 2);
    expect(firstPayment.principalPaid).toBeCloseTo(79582.55, 2);
  });

  it('should handle zero interest rate correctly', () => {
    const schedule = generateAmortizationSchedule(120000, 0, 1);

    expect(schedule[0].interestPaid).toBe(0);
    expect(schedule[0].principalPaid).toBe(10000);

    schedule.forEach((payment) => {
      expect(payment.interestPaid).toBe(0);
    });
  });
});
