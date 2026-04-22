import React, { useRef, useEffect } from 'react';
import { cn } from '../lib/utils';

interface WithdrawalPasswordInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function WithdrawalPasswordInput({ value, onChange }: WithdrawalPasswordInputProps) {
  const inputs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    if (!/^\d*$/.test(val)) return;

    const newValue = value.split('');
    newValue[index] = val.slice(-1);
    const updatedValue = newValue.join('');
    onChange(updatedValue);

    if (val && index < 5) {
      inputs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex gap-2 justify-between max-w-xs mx-auto" id="withdrawal-password-container">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          id={`withdrawal-digit-${i}`}
          ref={(el) => (inputs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          className={cn(
            "w-10 h-12 text-center text-xl font-bold border-2 rounded-lg transition-all focus:border-red-600 focus:outline-none bg-white",
            value[i] ? "border-red-500" : "border-gray-200"
          )}
        />
      ))}
    </div>
  );
}
