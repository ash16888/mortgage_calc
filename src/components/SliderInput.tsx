import React from 'react';

interface SliderInputProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  step: number;
  unit?: string;
  formatValue?: (value: number) => string;
}

export const SliderInput: React.FC<SliderInputProps> = ({
  label,
  value,
  onChange,
  min,
  max,
  step,
  unit = '',
  formatValue = (v) => v.toString(),
}) => {
  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(Number(e.target.value));
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    if (!isNaN(newValue) && newValue >= min && newValue <= max) {
      onChange(newValue);
    }
  };

  return (
    <div className="mb-4 sm:mb-6">
      <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
          aria-label={label}
        />
        <div className="flex items-center gap-1 w-full sm:w-auto">
          <input
            type="number"
            min={min}
            max={max}
            step={step}
            value={value}
            onChange={handleInputChange}
            className="w-full sm:w-32 md:w-36 px-2 sm:px-3 py-1.5 sm:py-2 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            aria-label={`${label} input`}
          />
          {unit && (
            <span className="text-gray-600 text-sm sm:text-base">{unit}</span>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-1 text-xs text-gray-500">
        <span>
          {formatValue(min)}
          {unit}
        </span>
        <span>
          {formatValue(max)}
          {unit}
        </span>
      </div>
    </div>
  );
};
