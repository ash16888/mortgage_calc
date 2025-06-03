export interface AmortizationScheduleItem {
  period: number;
  principalPaid: number;
  interestPaid: number;
  remainingPrincipal: number;
}

export function calculateMonthlyPayment(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyRate = annualRate / 12 / 100;
  const totalPayments = years * 12;

  if (monthlyRate === 0) {
    return principal / totalPayments;
  }

  const payment =
    (monthlyRate * principal) / (1 - Math.pow(1 + monthlyRate, -totalPayments));

  return payment;
}

export function calculateTotalInterest(
  principal: number,
  annualRate: number,
  years: number
): number {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  const totalPayments = years * 12;
  return monthlyPayment * totalPayments - principal;
}

export function generateAmortizationSchedule(
  principal: number,
  annualRate: number,
  years: number
): AmortizationScheduleItem[] {
  const monthlyPayment = calculateMonthlyPayment(principal, annualRate, years);
  const monthlyRate = annualRate / 12 / 100;
  const totalPayments = years * 12;

  const schedule: AmortizationScheduleItem[] = [];
  let remainingPrincipal = principal;

  for (let period = 1; period <= totalPayments; period++) {
    const interestPaid = remainingPrincipal * monthlyRate;
    const principalPaid = monthlyPayment - interestPaid;
    remainingPrincipal -= principalPaid;

    schedule.push({
      period,
      principalPaid: Math.max(0, principalPaid),
      interestPaid: Math.max(0, interestPaid),
      remainingPrincipal: Math.max(0, remainingPrincipal),
    });
  }

  return schedule;
}
