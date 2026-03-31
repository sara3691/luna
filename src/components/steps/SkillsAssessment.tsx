import React, { useState } from 'react';
import { StepProps } from '../../types';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Search, Check, ChevronRight, ArrowLeft } from 'lucide-react';

const SKILLS_BY_STREAM: Record<string, string[]> = {
    'Science': ['Mathematics', 'Biology', 'Physics', 'Chemistry', 'Programming', 'Critical Thinking', 'Lab Work', 'Data Analysis'],
    'Commerce': ['Accounting', 'Business Study', 'Economics', 'Banking', 'Management', 'Data Interpretation', 'Communication', 'Legal Studies'],
    'Arts / Humanities': ['Creative Writing', 'Public Speaking', 'Psychology', 'Graphic Design', 'Social Science', 'Research', 'Visual Arts', 'History']
};

export const SkillsAssessment: React.FC<StepProps> = ({ userData, updateUserData, onNext, onBack }) => {
    const streamSkills = SKILLS_BY_STREAM[userData.stream] || SKILLS_BY_STREAM['Science'];
    const [customSkill, setCustomSkill] = useState('');

    const toggleSkill = (skill: string) => {
        const newSkills = userData.skills.includes(skill)
            ? userData.skills.filter(s => s !== skill)
            : [...userData.skills, skill];
        updateUserData({ skills: newSkills });
    };

    const addCustomSkill = (e?: React.FormEvent) => {
        if (e) e.preventDefault();
        if (customSkill.trim() && !userData.skills.includes(customSkill.trim())) {
            updateUserData({ skills: [...userData.skills, customSkill.trim()] });
            setCustomSkill('');
        }
    };

    return (
        <div className="w-full max-w-2xl mx-auto py-6 md:py-10 px-0 md:px-4">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="corporate-card overflow-hidden !rounded-3xl md:!rounded-[2.5rem]"
            >
                <div className="p-6 md:p-8 bg-indigo-600 text-white flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <Target size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold">Skills Assessment</h2>
                        <p className="text-indigo-100 text-xs md:text-sm">Select your skills</p>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-8 md:space-y-10">
                    <div className="space-y-4">
                        <label className="label-text flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                            Common {userData.stream} Skills
                        </label>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {streamSkills.map(skill => (
                                <button
                                    key={skill}
                                    onClick={() => toggleSkill(skill)}
                                    className={`p-4 rounded-xl border-2 transition-all flex items-center justify-between text-xs md:text-sm min-h-[50px] ${userData.skills.includes(skill)
                                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-400'
                                            : 'border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-indigo-200 bg-white dark:bg-slate-900'
                                        }`}
                                >
                                    <span className="font-bold">{skill}</span>
                                    {userData.skills.includes(skill) && <Check size={16} />}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 pt-2 md:pt-4">
                        <label className="label-text">Not listed? Add your own</label>
                        <form onSubmit={addCustomSkill} className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="text"
                                value={customSkill}
                                onChange={(e) => setCustomSkill(e.target.value)}
                                placeholder="E.g. Digital Marketing..."
                                className="input-field flex-grow h-12 md:h-14 py-3 text-sm md:text-base"
                            />
                            <button
                                type="submit"
                                className="px-6 py-3 md:py-4 bg-slate-900 dark:bg-indigo-600 text-white font-bold rounded-xl shadow-lg hover:opacity-90 transition-all min-h-[44px]"
                            >
                                Add
                            </button>
                        </form>
                    </div>

                    {userData.skills.length > 0 && (
                        <div className="space-y-4 pt-4 md:pt-6">
                            <label className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">Selected Skills ({userData.skills.length})</label>
                            <div className="flex flex-wrap gap-2">
                                {userData.skills.map(skill => (
                                    <button
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className="text-[10px] md:text-xs font-bold px-3 py-1.5 bg-indigo-600 text-white rounded-lg flex items-center gap-2 group transition-all"
                                    >
                                        {skill}
                                        <div className="p-0.5 bg-white/20 rounded group-hover:bg-white/40">
                                            <Check size={10} />
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-6 md:pt-10">
                        <button
                            onClick={onBack}
                            className="w-full sm:flex-1 px-6 py-3 md:py-4 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/50 text-slate-600 dark:text-slate-400 font-bold transition-all flex items-center justify-center gap-2 min-h-[44px]"
                        >
                            <ArrowLeft size={18} />
                            Back
                        </button>
                        <button
                            onClick={onNext}
                            disabled={userData.skills.length === 0}
                            className="w-full sm:flex-[2] btn-primary flex items-center justify-center gap-2 disabled:opacity-50 disabled:grayscale transition-all min-h-[50px] md:min-h-[60px]"
                        >
                            Continue
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
