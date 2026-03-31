import React, { useState } from 'react';
import { StepProps } from '../../types';
import { GlassContainer } from '../ui/GlassContainer';
import { Search, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Popular courses by stream
const POPULAR_COURSES: Record<string, string[]> = {
    Science: [
        'B.Tech Computer Science', 'MBBS', 'B.Tech Electronics', 'B.Sc Data Science',
        'B.Pharm', 'B.Tech Mechanical', 'B.Sc Nursing', 'B.Tech Civil Engineering',
        'B.Tech Artificial Intelligence', 'B.Sc Physics', 'B.Tech Biotechnology', 'BAMS (Ayurveda)'
    ],
    Commerce: [
        'B.Com', 'Chartered Accountancy (CA)', 'BBA', 'MBA (after graduation)',
        'CMA (Cost Accountant)', 'CS (Company Secretary)', 'B.Com LLB', 'Actuarial Science',
        'B.Sc Economics', 'BBA Finance', 'Banking & Finance', 'Digital Marketing'
    ],
    Arts: [
        'Bachelor of Design (B.Des)', 'BA Psychology', 'BA Journalism', 'BA Social Work',
        'BA Political Science', 'LLB (Law)', 'B.Ed (Teaching)', 'Fine Arts',
        'BA Economics', 'Mass Communication', 'Hotel Management', 'BA English Literature'
    ]
};

export const CourseSelection: React.FC<StepProps> = ({ userData, updateUserData, onNext, onBack }) => {
    const [searchQuery, setSearchQuery] = useState(userData.selectedCourse || '');
    const [showSuggestions, setShowSuggestions] = useState(false);

    const streamCourses = POPULAR_COURSES[userData.stream] || POPULAR_COURSES['Science'];

    const filteredSuggestions = searchQuery.length > 0
        ? streamCourses.filter(c => c.toLowerCase().includes(searchQuery.toLowerCase()))
        : streamCourses;

    const handleSelect = (course: string) => {
        setSearchQuery(course);
        updateUserData({ selectedCourse: course });
        setShowSuggestions(false);
    };

    const handleInputChange = (val: string) => {
        setSearchQuery(val);
        updateUserData({ selectedCourse: val });
        setShowSuggestions(true);
    };

    const handleClear = () => {
        setSearchQuery('');
        updateUserData({ selectedCourse: '' });
        setShowSuggestions(false);
    };

    const canContinue = userData.selectedCourse && userData.selectedCourse.trim().length > 0;

    return (
        <div className="w-full max-w-2xl mx-auto py-6 md:py-10 px-0 md:px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="corporate-card overflow-hidden !rounded-3xl md:!rounded-[2.5rem]"
            >
                <div className="p-6 md:p-8 bg-indigo-600 text-white text-center">
                    <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-2xl bg-white/20 mb-4">
                        <Search size={24} className="md:w-8 md:h-8" />
                    </div>
                    <h2 className="text-xl md:text-3xl font-bold mb-2">Choose Your Course</h2>
                    <p className="text-indigo-100 text-xs md:text-sm italic opacity-80">
                        Type or select a course you're interested in.
                    </p>
                </div>

                <div className="p-6 md:p-8 space-y-6">
                    {/* Search Input */}
                    <div className="relative">
                        <label className="label-text flex items-center gap-2 mb-3">
                            <Sparkles size={14} className="text-indigo-600" />
                            Search Course
                        </label>
                        <div className="relative">
                            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => handleInputChange(e.target.value)}
                                onFocus={() => setShowSuggestions(true)}
                                placeholder={`Search for ${userData.stream}...`}
                                className="input-field pl-12 pr-10 py-3 md:py-4 text-sm md:text-base font-bold"
                            />
                            {searchQuery && (
                                <button
                                    onClick={handleClear}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                                >
                                    <X size={18} />
                                </button>
                            )}
                        </div>

                        <AnimatePresence>
                            {showSuggestions && filteredSuggestions.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="absolute z-20 w-full mt-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden max-h-52 overflow-y-auto"
                                >
                                    {filteredSuggestions.map((course) => (
                                        <button
                                            key={course}
                                            onClick={() => handleSelect(course)}
                                            className="w-full text-left px-5 py-3.5 text-xs md:text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all border-b border-slate-50 dark:border-slate-800/50 last:border-none font-medium"
                                        >
                                            {course}
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Popular Courses Grid */}
                    <div>
                        <p className="text-[10px] md:text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
                            Popular in {userData.stream}
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 md:gap-3">
                            {streamCourses.slice(0, 8).map((course) => (
                                <button
                                    key={course}
                                    onClick={() => handleSelect(course)}
                                    className={`p-3 md:p-4 rounded-xl border-2 text-left text-[11px] md:text-sm transition-all min-h-[44px] ${userData.selectedCourse === course
                                            ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-600 text-indigo-700 dark:text-indigo-400 font-bold'
                                            : 'bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-200'
                                        }`}
                                >
                                    {course}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Navigation */}
                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 md:pt-8 border-t border-slate-100 dark:border-slate-800">
                        <button
                            onClick={onBack}
                            className="w-full sm:flex-1 px-6 py-3 md:py-4 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 hover:bg-slate-50 font-bold transition-all min-h-[44px]"
                        >
                            Back
                        </button>
                        <button
                            onClick={onNext}
                            disabled={!canContinue}
                            className="w-full sm:flex-[2] btn-primary flex items-center justify-center gap-2 disabled:opacity-50 transition-all min-h-[50px] md:min-h-[60px]"
                        >
                            Next Step
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
