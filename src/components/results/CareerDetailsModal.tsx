import React, { useState, useEffect } from 'react';
import { CareerRecommendation, UserData, CollegeRecommendationResult } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Building2, MapPin, Compass, TrendingUp, CreditCard } from 'lucide-react';
import { getGroqCollegeRecommendations } from '../../services/groqService';
import { ScholarshipPanel } from './ScholarshipPanel';

interface Props {
    recommendation: CareerRecommendation | null;
    userData: UserData;
    onClose: () => void;
}

export const CareerDetailsModal: React.FC<Props> = ({ recommendation, userData, onClose }) => {
    const [modalColleges, setModalColleges] = useState<CollegeRecommendationResult[]>([]);
    const [modalCollegesLoading, setModalCollegesLoading] = useState(false);
    const [modalCollegesError, setModalCollegesError] = useState<string | null>(null);

    useEffect(() => {
        if (!recommendation) return;

        const fetchColleges = async () => {
            setModalCollegesLoading(true);
            setModalCollegesError(null);
            setModalColleges([]);
            try {
                const results = await getGroqCollegeRecommendations(
                    userData.selectedCourse || recommendation.title,
                    userData.location.state,
                    userData.location.anywhereInIndia,
                    userData.marks,
                    userData.stream,
                    userData.subjects,
                    userData.location.studyAbroad
                );
                setModalColleges(results);
            } catch (err: any) {
                console.error('Modal college fetch failed:', err);
                setModalCollegesError('Could not load institutions. Please try again.');
            } finally {
                setModalCollegesLoading(false);
            }
        };

        fetchColleges();
    }, [recommendation?.title, userData.location.state, userData.location.studyAbroad]);

    if (!recommendation) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/40 dark:bg-slate-950/80 backdrop-blur-md"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 30 }}
                    className="relative w-full h-full md:h-auto md:max-w-5xl md:max-h-[92vh] overflow-hidden bg-white dark:bg-slate-900 md:rounded-[2.5rem] shadow-2xl flex flex-col"
                >
                    {/* Close Button */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 md:top-6 md:right-6 z-[110] p-2 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-slate-500 dark:text-slate-400 transition-all border border-slate-200 dark:border-slate-700 shadow-md"
                    >
                        <X size={24} />
                    </button>

                    <div className="overflow-y-auto w-full custom-scrollbar flex-grow">
                        {/* Header Banner */}
                        <div className="p-6 md:p-12 bg-indigo-600">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-widest mb-4">
                                <TrendingUp size={12} />
                                High Growth Path
                            </div>
                            <h2 className="text-2xl md:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight">
                                {recommendation.title}
                            </h2>
                            <p className="text-sm md:text-xl text-indigo-100 leading-relaxed max-w-3xl font-medium">
                                {recommendation.description}
                            </p>
                        </div>

                        <div className="p-6 md:p-12 space-y-10 md:space-y-16">
                            {/* Stats Bar */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
                                <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-[9px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Duration</p>
                                    <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{recommendation.duration}</p>
                                </div>
                                <div className="p-4 md:p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl md:rounded-3xl border border-slate-100 dark:border-slate-700/50">
                                    <p className="text-[9px] md:text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 md:mb-2">Avg. Salary</p>
                                    <p className="text-lg md:text-2xl font-bold text-slate-900 dark:text-white">{recommendation.averageSalary}</p>
                                </div>
                                <div className="p-4 md:p-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-2xl md:rounded-3xl border border-indigo-100 dark:border-indigo-800">
                                    <p className="text-[9px] md:text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-widest mb-1 md:mb-2">Eligibility</p>
                                    <p className="text-base md:text-lg font-bold text-indigo-900 dark:text-indigo-200 line-clamp-1">{recommendation.eligibility}</p>
                                </div>
                            </div>

                            {/* Main Content Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16">
                                {/* Left: Roadmap */}
                                <div className="space-y-6 md:space-y-8">
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <Compass className="text-indigo-600 md:w-6 md:h-6" size={20} />
                                        Execution Roadmap
                                    </h3>
                                    <div className="space-y-6 relative before:absolute before:left-3 md:before:left-4 before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-100 dark:before:bg-slate-800">
                                        {recommendation.careerPath.map((step, i) => (
                                            <div key={i} className="flex items-start relative pl-10 md:pl-12 group">
                                                <div className="absolute left-0 w-6 h-6 md:w-8 md:h-8 rounded-full bg-white dark:bg-slate-900 border-2 border-indigo-600 flex items-center justify-center z-10 transition-transform group-hover:scale-110">
                                                    <div className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 rounded-full bg-indigo-600" />
                                                </div>
                                                <div className="bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-6 flex-grow shadow-sm transition-shadow">
                                                    <p className="text-xs md:text-sm text-slate-700 dark:text-slate-300 font-bold leading-relaxed">{step}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Right: Institutions */}
                                <div className="space-y-6 md:space-y-8">
                                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                        <Building2 className="text-indigo-600 md:w-6 md:h-6" size={20} />
                                        Target Institutions
                                    </h3>

                                    <div className="grid grid-cols-1 gap-3 md:gap-4">
                                        {modalCollegesLoading ? (
                                            <div className="p-6 md:p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                                                <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
                                                <p className="text-xs md:text-sm text-slate-500 font-medium italic">Finding institutions...</p>
                                            </div>
                                        ) : modalCollegesError ? (
                                            <div className="p-6 md:p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                                                <p className="text-xs md:text-sm text-slate-500 font-medium italic">{modalCollegesError}</p>
                                            </div>
                                        ) : modalColleges.length === 0 ? (
                                            <div className="p-6 md:p-8 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-center">
                                                <p className="text-xs md:text-sm text-slate-500 font-medium italic">No matches found in your preferred location.</p>
                                            </div>
                                        ) : (
                                            modalColleges.slice(0, 4).map((college, i) => (
                                                <div key={i} className="flex flex-col p-4 md:p-5 bg-white dark:bg-slate-800 rounded-xl md:rounded-2xl border border-slate-100 dark:border-slate-700 shadow-sm hover:shadow-md transition-all group">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <div className="flex items-center overflow-hidden">
                                                            <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center mr-3 md:mr-4 shrink-0 text-indigo-600 dark:text-indigo-400">
                                                                <MapPin size={18} className="md:w-5 md:h-5" />
                                                            </div>
                                                            <div className="overflow-hidden">
                                                                <p className="text-xs md:text-sm text-slate-900 dark:text-white font-bold leading-tight truncate">{college.name}</p>
                                                                <p className="text-[8px] md:text-[10px] text-slate-500 font-medium uppercase tracking-wider truncate">{college.location}, {college.state}</p>
                                                            </div>
                                                        </div>
                                                        <span className={`px-2 py-0.5 rounded md:rounded-md text-[8px] md:text-[9px] font-black uppercase tracking-tighter border ${
                                                            college.chance === 'High Chance' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                                                            college.chance === 'Medium Chance' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                            'bg-rose-50 text-rose-600 border-rose-100'
                                                        }`}>
                                                            {college.chance}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-3 md:gap-4 mt-2 pt-2 border-t border-slate-50 dark:border-slate-700/50">
                                                        <div className="flex items-center gap-1.5">
                                                            <CreditCard size={12} className="text-slate-400" />
                                                            <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase">{college.fees}</span>
                                                        </div>
                                                        <div className="flex items-center gap-1.5">
                                                            <TrendingUp size={12} className="text-slate-400" />
                                                            <span className="text-[8px] md:text-[10px] font-bold text-slate-500 uppercase">Cutoff: {college.cutoff}%</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>

                                    <div className="pt-6 md:pt-8">
                                        <h3 className="text-base md:text-lg font-bold text-slate-900 dark:text-white mb-4 md:mb-6">Expertise Tags</h3>
                                        <div className="flex flex-wrap gap-1.5 md:gap-2">
                                            {recommendation.tags.map(tag => (
                                                <span key={tag} className="px-3 md:px-5 py-1.5 md:py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 rounded-lg md:rounded-xl text-[8px] md:text-xs font-bold border border-slate-200 dark:border-slate-700 uppercase tracking-widest">
                                                    #{tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Scholarship Panel */}
                            <div className="pt-8">
                                <ScholarshipPanel
                                    course={userData.selectedCourse || recommendation.title}
                                    category={userData.category}
                                    aiScholarships={(recommendation as any).governmentScholarships}
                                />
                            </div>

                            {/* Close Footer */}
                            <div className="pt-10 md:pt-12 pb-8 text-center border-t border-slate-100 dark:border-slate-800">
                                <button
                                    onClick={onClose}
                                    className="w-full sm:w-auto px-12 md:px-16 py-4 md:py-5 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl md:rounded-2xl transition-all shadow-xl shadow-indigo-200 dark:shadow-none min-h-[44px]"
                                >
                                    CLOSE ANALYSIS
                                </button>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
