import React from 'react';
import { CareerRecommendation } from '../../types';
import { motion } from 'framer-motion';
import { Briefcase, BookOpen, IndianRupee, Clock, ArrowRight, Award, Target, Sparkles } from 'lucide-react';

interface Props {
    recommendations: CareerRecommendation[];
    isFallback: boolean;
    onRestart: () => void;
    onSelect: (rec: CareerRecommendation) => void;
}

export const CareerRecommendations: React.FC<Props> = ({ recommendations, isFallback, onRestart, onSelect }) => {
    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-8 md:py-12">
            {/* Header */}
            <div className="text-center mb-10 md:mb-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center gap-2 px-4 md:px-5 py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[10px] md:text-xs font-black uppercase tracking-widest mb-6 border border-indigo-100 dark:border-indigo-800"
                >
                    <Sparkles size={14} className="fill-current" />
                    <span>Career Compass Analysis Results</span>
                </motion.div>
                <h2 className="text-3xl md:text-5xl lg:text-7xl font-extrabold mb-4 md:mb-6 gradient-text tracking-tighter leading-tight">
                    Your Career Paths
                </h2>
                <p className="text-soft max-w-2xl mx-auto text-base md:text-xl font-medium leading-relaxed px-2 md:px-0">
                    Discover high-growth paths tailored to your unique potential and global opportunities.
                </p>
                {isFallback && (
                    <div className="mt-6 md:mt-8 inline-flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 rounded-2xl text-xs md:text-sm font-bold shadow-sm">
                        <span className="flex h-2 w-2 rounded-full bg-amber-500 animate-pulse shrink-0"></span>
                        AI Engine Busy: Showing expert-vetted recommendations.
                    </div>
                )}
            </div>

            {/* Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10">
                {recommendations.map((rec, index) => (
                    <motion.div
                        key={rec.id || index}
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.15, duration: 0.6, ease: "easeOut" }}
                        className="corporate-card group h-full flex flex-col"
                    >
                        <div className="p-6 md:p-10 flex flex-col flex-grow">
                            {/* Card Top Row */}
                            <div className="flex justify-between items-start mb-6 md:mb-10">
                                <div className="p-4 md:p-5 bg-indigo-50 dark:bg-indigo-900/40 rounded-2xl md:rounded-3xl text-indigo-600 dark:text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all duration-500 shadow-sm border border-indigo-100 dark:border-indigo-800/50">
                                    <Target size={24} className="md:w-8 md:h-8" />
                                </div>
                                <div className="px-3 py-1.5 bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 text-[9px] md:text-[10px] font-black rounded-full flex items-center gap-2 border border-slate-100 dark:border-slate-700 uppercase tracking-widest shrink-0">
                                    <Clock size={12} className="text-indigo-500" />
                                    {rec.duration}
                                </div>
                            </div>

                            {/* Title */}
                            <h3 className="text-xl md:text-3xl font-black mb-4 leading-tight text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300">
                                {rec.title}
                            </h3>

                            {/* Description */}
                            <p className="text-soft text-sm md:text-base mb-6 md:mb-10 leading-relaxed font-medium">
                                {rec.description}
                            </p>

                            {/* Info Box */}
                            <div className="mt-auto p-5 md:p-6 bg-slate-50 dark:bg-slate-950/40 rounded-2xl md:rounded-[2rem] space-y-4 md:space-y-5 mb-6 md:mb-10 border border-slate-100 dark:border-slate-800/50">
                                <div className="flex items-start">
                                    <BookOpen size={16} className="mr-3 md:mr-4 text-indigo-500 shrink-0 mt-0.5" />
                                    <span className="text-[10px] md:text-sm font-bold text-slate-700 dark:text-slate-300 leading-snug">{rec.eligibility}</span>
                                </div>
                                <div className="flex items-center">
                                    <IndianRupee size={16} className="mr-3 md:mr-4 text-emerald-500 shrink-0" />
                                    <span className="text-xs md:text-sm font-black text-slate-900 dark:text-white">Avg. {rec.averageSalary} <span className="text-[8px] md:text-[10px] font-bold text-slate-400 dark:text-slate-600 ml-1">PA</span></span>
                                </div>
                                <div className="flex items-center text-[10px] md:text-xs font-black text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                                    <Award size={16} className="mr-3 md:mr-4 shrink-0" />
                                    <span>Special Scholarships</span>
                                </div>
                            </div>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1.5 md:gap-2 mb-8 md:mb-10">
                                {rec.tags.slice(0, 3).map(tag => (
                                    <span
                                        key={tag}
                                        className="text-[8px] md:text-[9px] font-black px-3 md:px-4 py-1 md:py-1.5 bg-white dark:bg-slate-900 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700 rounded-lg md:rounded-xl uppercase tracking-widest shadow-sm"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={() => onSelect(rec)}
                                className="w-full btn-primary !px-5 md:!px-6 !py-4 md:!py-5 flex items-center justify-center gap-3 md:gap-4 text-xs md:text-sm group/btn min-h-[50px] md:min-h-[60px]"
                            >
                                <span>Get Roadmap Analysis</span>
                                <ArrowRight size={18} className="group-hover/btn:translate-x-1.5 transition-transform" />
                            </button>
                        </div>
                    </motion.div>
                ))}
            </div>

            {/* Restart */}
            <div className="mt-12 md:mt-24 text-center">
                <button
                    onClick={onRestart}
                    className="group w-full sm:w-fit px-8 md:px-12 py-4 md:py-5 rounded-2xl md:rounded-[2rem] border-2 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-black text-[10px] md:text-sm uppercase tracking-widest hover:bg-slate-50 dark:hover:bg-slate-800/50 hover:border-indigo-600 dark:hover:border-indigo-400 transition-all flex items-center justify-center gap-3 md:gap-4 mx-auto min-h-[44px]"
                >
                    <ArrowRight size={18} className="rotate-180 group-hover:-translate-x-1 transition-transform" />
                    Restart Assessment
                </button>
            </div>
        </div>
    );
};
