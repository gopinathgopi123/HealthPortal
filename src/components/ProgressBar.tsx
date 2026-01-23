import React from 'react';

interface ProgressBarProps {
  currentStep: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ currentStep }) => {
  const steps = [
    { number: 1, label: 'Contact Info' },
    { number: 2, label: 'Select Slot' },
    { number: 3, label: 'Patient Details' }
  ];

  return (
    <div className="max-w-12xl mx-auto px-4 mb-4 rounded-2xl p-3">
      {/* Mobile View */}
      <div className="md:hidden">
        <div className="flex flex-col items-center justify-center mb-3">
          <span className="text-sm font-medium mb-2">Step {currentStep} of {steps.length}</span>
          <div className="flex items-center gap-1">
            {steps.map((step, index) => (
              <React.Fragment key={step.number}>
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-300 ${
                    currentStep > step.number 
                      ? 'bg-blue-500 border-blue-500' 
                      : currentStep === step.number 
                      ? 'bg-blue-500 border-blue-500' 
                      : 'border-gray-300 bg-transparent'
                  }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : currentStep === step.number ? (
                    <div className="w-1.5 h-1.5 bg-white rounded-full" />
                  ) : (
                    <div className="w-1 h-1 bg-gray-300 rounded-full" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div 
                    className={`w-4 h-0.5 transition-all duration-300 ${
                      currentStep > step.number ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                  />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Normal Screen View */}
      <div className="hidden md:flex justify-center items-center py-2 bg-black  rounded-2xl  -m-3">
        <div className="relative flex flex-col items-center w-full max-w-4xl px-8 p-3">

          {/* Animated Progress Line Container - aligned with step centers */}
          <div className="absolute top-[1.7rem] left-14 right-14 h-[1px] bg-white/20">
            <div
              className="h-full bg-white transition-all duration-700 ease-in-out shadow-[0_0_10px_rgba(255,255,255,0.5)]"
              style={{
                width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
              }}
            />
          </div>

          {/* Steps */}
          <div className="flex justify-between items-center w-full relative z-10">
            {steps.map((step) => (
              <div key={step.number} className="flex flex-col items-center">
                {/* Circle Indicator */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-500 bg-black ${currentStep >= step.number ? 'border-white' : 'border-white/20'
                    }`}
                >
                  {currentStep > step.number ? (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : currentStep === step.number ? (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse shadow-[0_0_8px_white]" />
                  ) : (
                    <div className="w-2 h-2 bg-white/20 rounded-full" />
                  )}
                </div>

                {/* Label */}
                <span
                  className={`mt-3 text-[0.6rem] md:text-[0.65rem] font-bold uppercase tracking-[0.2em] text-center transition-colors duration-300 ${currentStep >= step.number ? 'text-white' : 'text-white/50'
                    }`}
                >
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
