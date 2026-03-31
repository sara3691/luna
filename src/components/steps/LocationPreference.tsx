import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepProps } from '../../types';
import { MapPin, Globe, Compass, ChevronRight, ArrowLeft, Check } from 'lucide-react';

const STATES = [
    "Tamil Nadu",
    "Karnataka",
    "Kerala",
    "Andhra Pradesh",
    "Telangana",
    "Maharashtra",
    "Delhi",
    "Others"
];

const COUNTRIES = [
    "USA",
    "UK",
    "Canada",
    "Australia",
    "Germany",
    "France",
    "Japan"
];

export const LocationPreference: React.FC<StepProps> = ({ userData, updateUserData, onNext, onBack }) => {
    // Current state based on userData or defaults
    const [selection, setSelection] = useState<'india' | 'state' | 'abroad'>(() => {
        if (userData.location.studyAbroad) return 'abroad';
        if (userData.location.anywhereInIndia) return 'india';
        if (userData.location.state) return 'state';
        return 'india';
    });

    const [selectedState, setSelectedState] = useState(userData.location.state || '');
    const [selectedCountry, setSelectedCountry] = useState(userData.location.studyAbroad ? (userData.location.state || '') : '');

    const handleSelect = (option: 'india' | 'state' | 'abroad') => {
        setSelection(option);
        if (option === 'india') {
            updateUserData({
                location: {
                    ...userData.location,
                    anywhereInIndia: true,
                    studyAbroad: false,
                    state: '',
                    districts: []
                }
            });
        } else if (option === 'state') {
            updateUserData({
                location: {
                    ...userData.location,
                    anywhereInIndia: false,
                    studyAbroad: false,
                    state: selectedState,
                    districts: []
                }
            });
        } else {
            updateUserData({
                location: {
                    ...userData.location,
                    anywhereInIndia: false,
                    studyAbroad: true,
                    state: selectedCountry,
                    districts: []
                }
            });
        }
    };

    const handleStateChange = (state: string) => {
        setSelectedState(state);
        updateUserData({ location: { ...userData.location, state, anywhereInIndia: false, studyAbroad: false } });
    };

    const handleCountryChange = (country: string) => {
        setSelectedCountry(country);
        updateUserData({ location: { ...userData.location, state: country, anywhereInIndia: false, studyAbroad: true } });
    };

    const isValid = () => {
        if (selection === 'india') return true;
        if (selection === 'state') return selectedState !== '';
        if (selection === 'abroad') return selectedCountry !== '';
        return false;
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-6 md:py-10 px-0 md:px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="corporate-card overflow-hidden shadow-2xl !rounded-3xl md:!rounded-[2.5rem]"
            >
                <div className="p-6 md:p-8 bg-indigo-600 dark:bg-indigo-700 text-white flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <MapPin size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold">Location Preference</h2>
                        <p className="text-indigo-100 text-xs md:text-sm">Where for education?</p>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-4 md:space-y-6">
                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                        {/* Option 1: Anywhere in India */}
                        <div
                            onClick={() => handleSelect('india')}
                            className={`p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-4 ${selection === 'india'
                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                                }`}
                        >
                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selection === 'india' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                                }`}>
                                {selection === 'india' && <Check size={12} className="text-white md:w-3.5 md:h-3.5" />}
                            </div>
                            <div className="flex-1">
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">Anywhere in India</h3>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Opportunities across all Indian states</p>
                            </div>
                            <Compass className={`${selection === 'india' ? 'text-indigo-600' : 'text-slate-300'} hidden sm:block`} />
                        </div>

                        {/* Option 2: Specific State */}
                        <div
                            onClick={() => handleSelect('state')}
                            className={`p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all ${selection === 'state'
                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                                }`}
                        >
                            <div className="flex items-center gap-4 mb-3 md:mb-4">
                                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selection === 'state' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                                    }`}>
                                    {selection === 'state' && <Check size={12} className="text-white md:w-3.5 md:h-3.5" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">Select Specific State</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">Focus within a particular state</p>
                                </div>
                                <MapPin className={`${selection === 'state' ? 'text-indigo-600' : 'text-slate-300'} hidden sm:block`} />
                            </div>

                            <AnimatePresence>
                                {selection === 'state' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="pt-2"
                                    >
                                        <select
                                            value={selectedState}
                                            onChange={(e) => handleStateChange(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="dropdown-field text-sm md:text-base py-3 md:py-4"
                                        >
                                            <option value="">Choose State</option>
                                            {STATES.map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Option 3: Study Abroad */}
                        <div
                            onClick={() => handleSelect('abroad')}
                            className={`p-4 md:p-5 rounded-2xl border-2 cursor-pointer transition-all ${selection === 'abroad'
                                    ? 'border-indigo-600 bg-indigo-50/50 dark:bg-indigo-900/20'
                                    : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                                }`}
                        >
                            <div className="flex items-center gap-4 mb-3 md:mb-4">
                                <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full border-2 flex items-center justify-center shrink-0 ${selection === 'abroad' ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300'
                                    }`}>
                                    {selection === 'abroad' && <Check size={12} className="text-white md:w-3.5 md:h-3.5" />}
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white text-sm md:text-base">Study Abroad</h3>
                                    <p className="text-xs text-slate-500 dark:text-slate-400">International education opportunities</p>
                                </div>
                                <Globe className={`${selection === 'abroad' ? 'text-indigo-600' : 'text-slate-300'} hidden sm:block`} />
                            </div>

                            <AnimatePresence>
                                {selection === 'abroad' && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="pt-2"
                                    >
                                        <select
                                            value={selectedCountry}
                                            onChange={(e) => handleCountryChange(e.target.value)}
                                            onClick={(e) => e.stopPropagation()}
                                            className="dropdown-field text-sm md:text-base py-3 md:py-4"
                                        >
                                            <option value="">Choose Country</option>
                                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 md:pt-8">
                        <button
                            onClick={onBack}
                            className="w-full sm:flex-1 px-6 py-3 md:py-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-700 dark:text-slate-400 font-bold transition-all flex items-center justify-center gap-2 min-h-[44px]"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                        <button
                            onClick={onNext}
                            className="w-full sm:flex-[2] btn-primary flex items-center justify-center gap-2 disabled:opacity-50 transition-all min-h-[50px] md:min-h-[60px]"
                            disabled={!isValid()}
                        >
                            View Results
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
