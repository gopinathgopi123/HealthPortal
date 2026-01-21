import React from 'react';

interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Contact details' },
    { number: 2, label: 'Slot' },
    { number: 3, label: 'Additional Information' }
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 mb-4">
      <div className="flex items-center justify-between relative px-2">
        {/* Continuous Background Line */}
        <div className="absolute top-[1.25rem] left-0 right-0 h-[1px] bg-slate-800 -z-10" />

        {/* Animated Progress Line */}
        <div className="absolute top-[1.25rem] left-0 right-0 h-[1px] -z-10 bg-transparent">
          <div
            className="h-full bg-primary-gradient transition-all duration-700 ease-in-out"
            style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
          />
        </div>


        {steps.map((step) => (
          <div key={step.number} className="flex flex-col items-center">
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 ${currentStep >= step.number
                ? 'border-2 border-accent-teal bg-slate-950 shadow-[0_0_15px_rgba(7,162,125,0.2)]'
                : 'border border-slate-700 bg-slate-950 shadow-inner'
                }`}
            >
              {currentStep > step.number ? (
                <svg className="w-5 h-5 text-accent-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              ) : currentStep === step.number ? (
                <div className="w-2.5 h-2.5 bg-accent-teal rounded-full" />
              ) : (
                <div className="w-1.5 h-1.5 bg-slate-700 rounded-full opacity-50" />
              )}
            </div>
            <span
              className={`mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] transition-colors duration-300 ${currentStep >= step.number ? 'text-white' : 'text-slate-500'
                }`}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};
export default ProgressBar;
