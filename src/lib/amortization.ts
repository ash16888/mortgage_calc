export interface AmortizationScheduleItem {
  period: number;
  principalPaid: number;
  interestPaid: number;
  remainingPrincipal: number;
  prepayment?: number;
  totalPayment?: number;
}

export interface Prepayment {
  type: 'oneTime' | 'monthly';
  amount: number;
  startMonth?: number;
  reduceType: 'term' | 'payment';
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
  years: number,
  prepayments: Prepayment[] = []
): AmortizationScheduleItem[] {
  const monthlyRate = annualRate / 12 / 100;
  const totalPayments = years * 12;
  const baseMonthlyPayment = calculateMonthlyPayment(
    principal,
    annualRate,
    years
  );

  const schedule: AmortizationScheduleItem[] = [];
  let remainingPrincipal = principal;
  let currentMonthlyPayment = baseMonthlyPayment;

  const oneTimePrepayments = prepayments.filter((p) => p.type === 'oneTime');
  const monthlyPrepayment = prepayments.find((p) => p.type === 'monthly');

  for (
    let period = 1;
    period <= totalPayments && remainingPrincipal > 0;
    period++
  ) {
    const interestPaid = remainingPrincipal * monthlyRate;
    let principalPaid = currentMonthlyPayment - interestPaid;
    let prepaymentAmount = 0;

    // Apply monthly prepayment
    if (
      monthlyPrepayment &&
      (!monthlyPrepayment.startMonth || period >= monthlyPrepayment.startMonth)
    ) {
      prepaymentAmount += monthlyPrepayment.amount;
    }

    // Apply one-time prepayments
    const oneTimePrepayment = oneTimePrepayments.find(
      (p) => p.startMonth === period
    );
    if (oneTimePrepayment) {
      prepaymentAmount += oneTimePrepayment.amount;
    }

    // Ensure we don't overpay
    prepaymentAmount = Math.min(
      prepaymentAmount,
      remainingPrincipal - principalPaid
    );
    principalPaid += prepaymentAmount;

    remainingPrincipal -= principalPaid;

    // Recalculate if needed (for payment reduction type)
    if (
      prepaymentAmount > 0 &&
      prepayments.some((p) => p.reduceType === 'payment')
    ) {
      const remainingMonths = totalPayments - period;
      if (remainingMonths > 0 && remainingPrincipal > 0) {
        currentMonthlyPayment = calculateMonthlyPayment(
          remainingPrincipal,
          annualRate,
          remainingMonths / 12
        );
      }
    }

    schedule.push({
      period,
      principalPaid: Math.max(0, principalPaid),
      interestPaid: Math.max(0, interestPaid),
      remainingPrincipal: Math.max(0, remainingPrincipal),
      prepayment: prepaymentAmount > 0 ? prepaymentAmount : undefined,
      totalPayment: currentMonthlyPayment + prepaymentAmount,
    });

    // For term reduction, we may finish early
    if (remainingPrincipal <= 0) {
      break;
    }
  }

  return schedule;
}

export function calculateTotalInterestWithPrepayments(
  principal: number,
  annualRate: number,
  years: number,
  prepayments: Prepayment[] = []
): number {
  const schedule = generateAmortizationSchedule(
    principal,
    annualRate,
    years,
    prepayments
  );
  return schedule.reduce((total, item) => total + item.interestPaid, 0);
}
