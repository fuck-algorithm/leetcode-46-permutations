import { useState, FormEvent } from 'react';
import { validateInput } from '../engine/validation';
import './InputPanel.css';

interface InputPanelProps {
  onSubmit: (nums: number[]) => void;
  disabled: boolean;
}

// 预设数据
const PRESETS = [
  { label: '[1,2]', value: '1,2' },
  { label: '[1,2,3]', value: '1,2,3' },
  { label: '[1,2,3,4]', value: '1,2,3,4' },
];

export function InputPanel({ onSubmit, disabled }: InputPanelProps) {
  const [input, setInput] = useState('1,2,3');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e?: FormEvent) => {
    e?.preventDefault();
    const result = validateInput(input);

    if (result.isValid && result.parsedNumbers) {
      setError(null);
      onSubmit(result.parsedNumbers);
    } else {
      setError(result.error || '输入无效');
    }
  };

  const handlePresetClick = (value: string) => {
    setInput(value);
    setError(null);
    const result = validateInput(value);
    if (result.isValid && result.parsedNumbers) {
      onSubmit(result.parsedNumbers);
    }
  };

  return (
    <div className="input-panel">
      <form onSubmit={handleSubmit} className="input-form">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="1,2,3"
          disabled={disabled}
          className="input-field"
        />
        <button type="submit" disabled={disabled} className="submit-btn">
          开始
        </button>
        <div className="presets">
          {PRESETS.map((preset) => (
            <button
              key={preset.value}
              type="button"
              className={`preset-btn ${input === preset.value ? 'active' : ''}`}
              onClick={() => handlePresetClick(preset.value)}
              disabled={disabled}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </form>
      {error && <div className="error-message">{error}</div>}
    </div>
  );
}
