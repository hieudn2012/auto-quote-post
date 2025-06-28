import { useState, useRef, useEffect } from "react";

interface Option {
  value: string;
  label: string | React.ReactNode;
}

interface MultipleSelectProps {
  options: Option[];
  value: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  label?: string;
  className?: string;
}

export const MultipleSelect = ({
  options,
  value,
  onChange,
  placeholder = "Select options...",
  label,
  className = "",
}: MultipleSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleOptionClick = (optionValue: string) => {
    const newValue = value.includes(optionValue)
      ? value.filter(v => v !== optionValue)
      : [...value, optionValue];
    onChange(newValue);
  };

  const getSelectedLabels = () => {
    return value.map(v => options.find(opt => opt.value === v)?.label).filter(Boolean).join(", ");
  };

  const handleClear = () => {
    onChange([]);
  };

  return (
    <div className={`flex flex-col gap-1 w-full ${className}`}>
      {label && (
        <div className="text-sm font-medium text-gray-700">{label}</div>
      )}
      <div className="relative" ref={dropdownRef}>
        <div
          className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 cursor-pointer hover:border-gray-400 transition-all duration-200 flex items-center justify-between"
          onClick={handleToggle}
        >
          <div className="flex-1 min-h-[20px] overflow-hidden">
            {value.length > 0 ? (
              <div className="text-gray-900 truncate max-w-full select-none">{getSelectedLabels()}</div>
            ) : (
              <div className="text-gray-500 truncate max-w-full select-none">{placeholder}</div>
            )}
          </div>
          <div className="flex items-center gap-1">
            {value.length > 0 && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors duration-150"
                title="Clear selection"
              >
                <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
            <div className={`transition-transform duration-200 flex-shrink-0 ${isOpen ? 'rotate-180' : ''}`}>
              <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-400"></div>
            </div>
          </div>
        </div>
        {isOpen && (
          <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
            {options.map((option) => (
              <div
                key={option.value}
                className={`px-3 py-2 cursor-pointer hover:bg-gray-100 transition-colors duration-150 flex items-center ${value.includes(option.value) ? 'bg-blue-50 text-blue-700' : 'text-gray-900'
                  }`}
                onClick={() => handleOptionClick(option.value)}
              >
                <div className={`w-4 h-4 border rounded mr-2 flex items-center justify-center ${value.includes(option.value)
                    ? 'bg-blue-500 border-blue-500'
                    : 'border-gray-300'
                  }`}>
                  {value.includes(option.value) && (
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  )}
                </div>
                <div className="flex-1">{option.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
