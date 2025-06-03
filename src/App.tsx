import { useState, useMemo } from 'react';
import { SliderInput } from '@/components/SliderInput';
import { LoanSummary } from '@/components/LoanSummary';
import { AmortizationChart } from '@/components/AmortizationChart';
import {
  calculateMonthlyPayment,
  calculateTotalInterest,
  generateAmortizationSchedule,
} from '@/lib/amortization';

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

  const formatCurrency = (value: number): string => {
    return new Intl.NumberFormat('ru-RU').format(value);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Кредитный калькулятор
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
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
              formatValue={formatCurrency}
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
          </div>

          <div>
            <LoanSummary
              monthlyPayment={monthlyPayment}
              totalInterest={totalInterest}
              principal={principal}
            />
          </div>
        </div>

        <div className="mt-8">
          <AmortizationChart schedule={amortizationSchedule} />
        </div>
      </div>
    </div>
  );
}

export default App;
