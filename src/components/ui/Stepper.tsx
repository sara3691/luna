import React from 'react';

interface StepperProps {
    currentStep: number;
    totalSteps: number;
}

const STEP_LABELS = ['Academic', 'Skills', 'Interests', 'Location'];

export const Stepper: React.FC<StepperProps> = ({ currentStep, totalSteps }) => {
    return (
        <div className="mb-10 md:mb-16 mt-4">
            <div className="flex items-center justify-center max-w-lg mx-auto">
                {Array.from({ length: totalSteps }).map((_, idx) => {
                    const stepNum = idx + 1;
                    const isCompleted = stepNum < currentStep;
                    const isActive = stepNum === currentStep;

                    return (
                        <React.Fragment key={idx}>
                            <div className="flex flex-col items-center relative group">
                                <div
                                    className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-[10px] md:text-xs font-black transition-all duration-500 z-10 ${isCompleted
                                            ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 dark:shadow-none border-2 border-indigo-600'
                                            : isActive
                                                ? 'bg-indigo-600 text-white ring-4 ring-indigo-500/20 dark:ring-indigo-500/10 shadow-xl border-2 border-indigo-600 scale-110'
                                                : 'bg-white dark:bg-slate-800 text-slate-400 dark:text-slate-500 border-2 border-slate-100 dark:border-slate-800'
                                        }`}
                                >
                                    {isCompleted ? '✓' : stepNum}
                                </div>
                                <span
                                    className={`absolute -bottom-6 md:-bottom-7 w-max text-[8px] md:text-[10px] font-black uppercase tracking-widest transition-colors duration-300 ${isActive
                                            ? 'text-indigo-600 dark:text-indigo-400 scale-110'
                                            : isCompleted
                                                ? 'text-slate-500 dark:text-slate-400'
                                                : 'text-slate-300 dark:text-slate-700'
                                        }`}
                                >
                                    <span className="hidden sm:inline">{STEP_LABELS[idx] || `Step ${stepNum}`}</span>
                                    <span className="sm:hidden">{isActive ? STEP_LABELS[idx] : stepNum}</span>
                                </span>
                            </div>

                            {idx < totalSteps - 1 && (
                                <div className="flex-grow h-[2px] md:h-[3px] bg-slate-100 dark:bg-slate-800 relative mx-1 md:mx-2 -mt-6 md:-mt-7">
                                    <div
                                        className="absolute inset-0 bg-indigo-600 transition-all duration-700 ease-in-out"
                                        style={{ width: isCompleted ? '100%' : '0%' }}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    );
                })}
            </div>
        </div>
    );
};
