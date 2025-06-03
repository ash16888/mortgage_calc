import { useState, useMemo } from 'react';
import { SliderInput } from '@/components/SliderInput';
import { LoanSummary } from '@/components/LoanSummary';
import { AmortizationChart } from '@/components/AmortizationChart';
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  generateAmortizationSchedule,
} from '@/lib/amortization';
import { formatNumber } from '@/lib/formatters';

function App() {
  const [principal, setPrincipal] = useState(5000000);
  const [annualRate, setAnnualRate] = useState(12);
  const [years, setYears] = useState(15);

  const monthlyPayment = useMemo(
    () => calculateMonthlyPayment(principal, annualRate, years),
    [principal, annualRate, years]
  );

  const totalInterest = useMemo(
    () => calculateTotalInterest(principal, annualRate, years),
    [principal, annualRate, years]
  );

  const amortizationSchedule = useMemo(
    () => generateAmortizationSchedule(principal, annualRate, years),
    [principal, annualRate, years]
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8 max-w-6xl">
        <header>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 sm:mb-8 text-center">
            Кредитный калькулятор
          </h1>
        </header>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <section
            className="bg-white rounded-lg shadow-md p-4 sm:p-6"
            aria-labelledby="loan-params"
          >
            <h2
              id="loan-params"
              className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 sm:mb-6"
            >
              Параметры кредита
            </h2>

            <SliderInput
              label="Сумма кредита"
              value={principal}
              onChange={setPrincipal}
              min={100000}
              max={30000000}
              step={100000}
              unit="₽"
              formatValue={formatNumber}
            />

            <SliderInput
              label="Процентная ставка"
              value={annualRate}
              onChange={setAnnualRate}
              min={0.1}
              max={30}
              step={0.1}
              unit="%"
            />

            <SliderInput
              label="Срок кредита"
              value={years}
              onChange={setYears}
              min={1}
              max={30}
              step={1}
              unit="лет"
            />
          </section>

          <section aria-labelledby="loan-results">
            <LoanSummary
              monthlyPayment={monthlyPayment}
              totalInterest={totalInterest}
              principal={principal}
            />
          </section>
        </main>

        <section
          className="mt-4 sm:mt-6 lg:mt-8"
          aria-labelledby="amortization-chart"
        >
          <AmortizationChart schedule={amortizationSchedule} />
        </section>
      </div>
    </div>
  );
}

export default App;
