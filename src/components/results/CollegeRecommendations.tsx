import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, CreditCard, TrendingUp, GraduationCap, Trophy, Info } from 'lucide-react';
import { CollegeRecommendationResult, ChanceStatus } from '../../types';

interface Props {
    recommendations: CollegeRecommendationResult[];
    selectedCourse: string;
    isLoading?: boolean;
    error?: string;
}

const statusConfig: Record<ChanceStatus, { bg: string, text: string, border: string }> = {
    'High Chance': {
        bg: 'bg-emerald-50 dark:bg-emerald-900/20',
        text: 'text-emerald-700 dark:text-emerald-400',
        border: 'border-emerald-200 dark:border-emerald-800'
    },
    'Medium Chance': {
        bg: 'bg-amber-50 dark:bg-amber-900/20',
        text: 'text-amber-700 dark:text-amber-400',
        border: 'border-amber-200 dark:border-amber-800'
    },
    'Low Chance': {
        bg: 'bg-rose-50 dark:bg-rose-900/20',
        text: 'text-rose-700 dark:text-rose-400',
        border: 'border-rose-200 dark:border-rose-800'
    }
};

export const CollegeRecommendations: React.FC<Props> = ({ recommendations, selectedCourse, isLoading, error }) => {
    return (
        <section className="mt-12 md:mt-24 max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 md:mb-12 gap-6">
                <div>
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 border border-slate-200 dark:border-slate-700"
                    >
                        <GraduationCap size={14} />
                        <span>Institution Matching</span>
                    </motion.div>
                    <h2 className="text-3xl md:text-5xl font-black text-slate-900 dark:text-white tracking-tight leading-tight">
                        Top <span className="text-indigo-600 dark:text-indigo-400">College</span> Recommendations
                    </h2>
                    <p className="mt-4 text-slate-500 dark:text-slate-400 font-medium max-w-xl text-sm md:text-base">
                        Personalized matching for <span className="text-slate-900 dark:text-white font-bold italic">"{selectedCourse}"</span>
                    </p>
                </div>

                {recommendations.length > 0 && (
                    <div className="flex items-center gap-3 px-6 py-3 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm w-fit">
                        <div className="flex -space-x-2">
                            {[1, 2, 3].map(i => (
                                <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 bg-slate-${i * 100 + 100}`} />
                            ))}
                        </div>
                        <span className="text-[10px] md:text-xs font-bold text-slate-600 dark:text-slate-400">
                            {recommendations.length} Matches Found
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {isLoading ? (
                    <div className="col-span-full py-12 md:py-20 px-6 md:px-8 rounded-3xl md:rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-indigo-50 dark:bg-indigo-900/10 rounded-full flex items-center justify-center mx-auto mb-6">
                            <div className="w-6 h-6 md:w-8 md:h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2">Analyzing Target Institutions</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-sm mx-auto">
                            Searching for real-time college data and admission requirements...
                        </p>
                    </div>
                ) : error ? (
                    <div className="col-span-full py-12 md:py-20 px-6 md:px-8 rounded-3xl md:rounded-[3rem] border-2 border-dashed border-rose-200 dark:border-rose-900/30 text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-rose-50 dark:bg-rose-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Info size={28} className="text-rose-500" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2">Service Unavailable</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-sm mx-auto">
                            {error}
                        </p>
                    </div>
                ) : recommendations.length > 0 ? (
                    recommendations.map((college, index) => (
                        <motion.div
                            key={college.id}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className="bg-white dark:bg-slate-900 rounded-[2rem] md:rounded-[2.5rem] border border-slate-200/60 dark:border-slate-800/60 overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 hover:border-indigo-500/30 transition-all duration-500 flex flex-col h-full"
                        >
                            {/* Card Header with Status Badge */}
                            <div className="p-6 md:p-8 pb-4">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="p-3 md:p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-700/50 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-500 transition-colors duration-500">
                                        <Trophy size={20} className="md:w-6 md:h-6" />
                                    </div>
                                    <span className={`px-3 md:px-4 py-1.5 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-wider border ${statusConfig[college.chance].bg} ${statusConfig[college.chance].text} ${statusConfig[college.chance].border}`}>
                                        {college.chance}
                                    </span>
                                </div>
                                <h3 className="text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {college.name}
                                </h3>
                                <div className="flex items-center text-slate-500 dark:text-slate-400 text-xs md:text-sm font-semibold">
                                    <MapPin size={14} className="mr-2 text-indigo-500" />
                                    {college.location}, {college.state}
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="px-6 md:px-8 py-4 md:py-6 space-y-4 md:space-y-5 flex-grow">
                                <div className="flex flex-col gap-3 md:gap-4 p-4 md:p-5 bg-slate-50/50 dark:bg-slate-800/30 rounded-2xl md:rounded-3xl border border-slate-100/50 dark:border-white/5">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <CreditCard size={14} className="text-slate-400 md:w-4 md:h-4" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Fees</span>
                                        </div>
                                        <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white">{college.fees}</span>
                                    </div>
                                    <div className="w-full h-px bg-slate-200/50 dark:bg-slate-700/50" />
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 md:gap-3">
                                            <TrendingUp size={14} className="text-slate-400 md:w-4 md:h-4" />
                                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Cutoff</span>
                                        </div>
                                        <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white">{college.cutoff}%</span>
                                    </div>
                                </div>

                                {college.entranceExam && (
                                    <div className="flex items-center gap-2 md:gap-3 px-4 md:px-5 py-3 md:py-4 bg-indigo-50/50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 text-[10px] md:text-xs">
                                        <Info size={14} className="text-indigo-500 shrink-0 md:w-4 md:h-4" />
                                        <span className="font-bold text-indigo-700 dark:text-indigo-300">
                                            Admission via <span className="underline decoration-indigo-300 underline-offset-4">{college.entranceExam}</span>
                                        </span>
                                    </div>
                                )}

                                <div className="flex flex-wrap gap-2">
                                    {college.tags.map(tag => (
                                        <span key={tag} className="text-[8px] md:text-[9px] font-black px-2 md:px-3 py-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-400 uppercase tracking-widest transition-colors">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="p-6 md:p-8 pt-0 mt-auto">
                                <button className="w-full py-3.5 md:py-4 bg-slate-900 dark:bg-indigo-600 hover:bg-indigo-600 dark:hover:bg-indigo-500 text-white rounded-xl md:rounded-2xl text-[10px] md:text-xs font-black uppercase tracking-[0.2em] transition-all transform active:scale-95 shadow-lg border border-transparent min-h-[44px]">
                                    Admission Brochure
                                </button>
                            </div>
                        </motion.div>
                    ))
                ) : (
                    <div className="col-span-full py-16 md:py-20 px-6 md:px-8 rounded-3xl md:rounded-[3rem] border-2 border-dashed border-slate-200 dark:border-slate-800 text-center">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                            <GraduationCap size={28} className="text-slate-300 md:w-8 md:h-8" />
                        </div>
                        <h3 className="text-lg md:text-xl font-black text-slate-900 dark:text-white mb-2">No Matching Institutions</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-xs md:text-sm max-w-sm mx-auto">
                            Try adjusting your criteria to see more results.
                        </p>
                    </div>
                )}
            </div>
        </section>
    );
};
