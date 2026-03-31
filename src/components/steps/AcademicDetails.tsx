import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { StepProps, Stream } from '../../types';
import { GraduationCap, BookOpen, BarChart3, ChevronRight, School, User, Layers, IndianRupee, Sparkles } from 'lucide-react';

const BOARDS = [
    "Tamil Nadu State Board",
    "CBSE",
    "ICSE",
    "Other State Board",
    "International Board"
];

const ACADEMIC_DATA: Record<string, Record<string, string[]>> = {
    "Tamil Nadu State Board": {
        "Science": ["Medicine / Engineering (Mathematics + Biology)", "Pure Science (Biology + Home Science)", "Computer Science (Mathematics + Computer Science)"],
        "Commerce": ["Commerce with Mathematics", "Commerce with Computer Science"],
        "Arts / Humanities": ["History, Economics, Pol. Science", "Psychology, Sociology", "Literature, Philosophy"]
    },
    "CBSE": {
        "Science": ["PCM (Physics, Chemistry, Mathematics)", "PCB (Physics, Chemistry, Biology)", "PCMB (Physics, Chemistry, Mathematics, Biology)"],
        "Commerce": ["Commerce (with Maths)", "Commerce (without Maths)"],
        "Arts / Humanities": ["Humanities (History, Pol. Science)", "Arts (Fine Arts, Psychology)"]
    },
    "ICSE": {
        "Science": ["Science with Mathematics", "Science without Mathematics"],
        "Commerce": ["Accounts and Economics", "Commerce and accounts"],
        "Arts / Humanities": ["Humanities Integrated", "Fine Arts Focus"]
    },
    "Other State Board": {
        "Science": ["General Science (PCM)", "Medical Science (PCB)"],
        "Commerce": ["Accountancy and Finance"],
        "Arts / Humanities": ["Social Sciences"]
    },
    "International Board": {
        "Science": ["Standard Science High Level", "Advanced Science"],
        "Commerce": ["Business Management & Economics"],
        "Arts / Humanities": ["Liberal Arts Pathways"]
    }
};

export const AcademicDetails: React.FC<StepProps> = ({ userData, updateUserData, onNext }) => {
    const [marks, setMarks] = useState(userData.marks || '');
    const streams = userData.educationBoard ? Object.keys(ACADEMIC_DATA[userData.educationBoard] || {}) : [];
    const courses = (userData.educationBoard && userData.stream) ? ACADEMIC_DATA[userData.educationBoard][userData.stream] || [] : [];

    const handleBoardChange = (board: string) => {
        updateUserData({ educationBoard: board, stream: '', subjects: '' });
    };

    const handleStreamChange = (stream: string) => {
        updateUserData({ stream: stream as Stream, subjects: '' });
    };

    const isFormValid = userData.educationBoard && userData.stream && userData.subjects && marks !== '' && Number(marks) >= 0 && Number(marks) <= 100;

    return (
        <div className="w-full max-w-2xl mx-auto py-6 md:py-10 px-0 md:px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="corporate-card overflow-hidden !rounded-3xl md:!rounded-[2.5rem]"
            >
                <div className="p-6 md:p-8 bg-indigo-600 text-white flex items-center gap-4">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <GraduationCap size={24} className="md:w-7 md:h-7" />
                    </div>
                    <div>
                        <h2 className="text-xl md:text-2xl font-bold">Academic Profile</h2>
                        <p className="text-indigo-100 text-xs md:text-sm">Tell us about your foundation</p>
                    </div>
                </div>

                <div className="p-6 md:p-8 space-y-6 md:space-y-8">
                    {/* Select Board */}
                    <div className="space-y-3">
                        <label className="label-text flex items-center gap-2">
                            <Layers size={14} className="text-indigo-600 md:w-4 md:h-4" />
                            Select Board
                        </label>
                        <select
                            value={userData.educationBoard}
                            onChange={(e) => handleBoardChange(e.target.value)}
                            className="dropdown-field text-sm md:text-base"
                        >
                            <option value="">Select your board</option>
                            {BOARDS.map(board => <option key={board} value={board}>{board}</option>)}
                        </select>
                    </div>

                    <AnimatePresence mode="wait">
                        {userData.educationBoard && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="space-y-6 md:space-y-8"
                            >
                                {/* Select Stream */}
                                <div className="space-y-3">
                                    <label className="label-text flex items-center gap-2">
                                        <BookOpen size={14} className="text-indigo-600 md:w-4 md:h-4" />
                                        Choose Stream
                                    </label>
                                    <select
                                        value={userData.stream}
                                        onChange={(e) => handleStreamChange(e.target.value)}
                                        className="dropdown-field text-sm md:text-base"
                                    >
                                        <option value="">Select your stream</option>
                                        {streams.map(stream => <option key={stream} value={stream}>{stream}</option>)}
                                    </select>
                                </div>

                                <AnimatePresence mode="wait">
                                    {userData.stream && (
                                        <motion.div
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            className="space-y-6 md:space-y-8"
                                        >
                                            {/* Select Course */}
                                            <div className="space-y-4">
                                                <label className="label-text flex items-center gap-2">
                                                    <School size={14} className="text-indigo-600 md:w-4 md:h-4" />
                                                    Current Course / Group
                                                </label>
                                                <div className="grid grid-cols-1 gap-2 md:gap-3">
                                                    {courses.map(course => (
                                                        <button
                                                            key={course}
                                                            onClick={() => updateUserData({ subjects: course })}
                                                            className={`text-left p-4 rounded-xl border-2 transition-all flex items-center justify-between group min-h-[50px] ${userData.subjects === course
                                                                ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-900/20'
                                                                : 'border-slate-100 dark:border-slate-800 hover:border-indigo-200'
                                                                }`}
                                                        >
                                                            <span className={`text-xs md:text-sm font-medium ${userData.subjects === course ? 'text-indigo-700 dark:text-indigo-400' : 'text-slate-600 dark:text-slate-400'}`}>
                                                                {course}
                                                            </span>
                                                            {userData.subjects === course && (
                                                                <div className="w-4 h-4 md:w-5 md:h-5 bg-indigo-600 rounded-full flex items-center justify-center shrink-0">
                                                                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full" />
                                                                </div>
                                                            )}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Marks Input */}
                                            <div className="space-y-3">
                                                <label className="label-text flex items-center gap-2">
                                                    <BarChart3 size={14} className="text-indigo-600 md:w-4 md:h-4" />
                                                    Marks (%)
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="number"
                                                        value={marks}
                                                        onChange={(e) => {
                                                            setMarks(e.target.value);
                                                            updateUserData({ marks: Number(e.target.value) });
                                                        }}
                                                        placeholder="e.g. 85"
                                                        className="input-field pr-12 font-bold text-lg md:text-xl py-3 md:py-4"
                                                        min="0"
                                                        max="100"
                                                    />
                                                    <span className="absolute right-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">%</span>
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Next Button */}
                    <div className="pt-4 md:pt-6">
                        <button
                            onClick={onNext}
                            disabled={!isFormValid}
                            className="w-full btn-primary flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale transition-all shadow-xl min-h-[50px] md:min-h-[60px]"
                        >
                            Next Step
                            <ChevronRight size={20} />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
