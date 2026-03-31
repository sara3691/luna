import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, BookOpen, ExternalLink, Globe, GraduationCap } from 'lucide-react';

// ── Static curated government scholarship portals ─────────────────────────────
const GOVT_SCHOLARSHIP_PORTALS = [
    {
        name: 'National Scholarship Portal (NSP)',
        description: 'Central government scholarships for SC/ST/OBC/Minority students',
        link: 'https://scholarships.gov.in',
        badge: 'Central Govt',
        color: 'emerald'
    },
    {
        name: 'PM Scholarship Scheme',
        description: 'Scholarship for wards of Ex-Servicemen & Coast Guard personnel',
        link: 'https://ksb.gov.in/pm-scholarship-scheme.htm',
        badge: 'Central Govt',
        color: 'emerald'
    },
    {
        name: 'Buddy4Study – India Scholarships',
        description: 'Largest scholarship discovery platform — 10,000+ scholarships listed',
        link: 'https://www.buddy4study.com',
        badge: 'Aggregator',
        color: 'blue'
    },
    {
        name: 'Vidyasaarathi Scholarship Portal',
        description: 'CSR-funded scholarships for meritorious & needy students',
        link: 'https://www.vidyasaarathi.co.in',
        badge: 'CSR / Pvt',
        color: 'purple'
    },
    {
        name: 'AICTE Pragati & Saksham',
        description: 'AICTE scholarships for girls & students with disabilities in technical courses',
        link: 'https://www.aicte-india.org/bureaus/scholarship',
        badge: 'AICTE',
        color: 'orange'
    },
    {
        name: 'UGC Scholarship Schemes',
        description: 'University Grants Commission – Post-graduate & research scholarships',
        link: 'https://www.ugc.gov.in/scholarship',
        badge: 'UGC',
        color: 'pink'
    },
];

// colour map for badge variants
const colorMap: Record<string, string> = {
    emerald: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-600 dark:text-emerald-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-600 dark:text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-600 dark:text-purple-400',
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-600 dark:text-orange-400',
    pink: 'bg-pink-500/10 border-pink-500/20 text-pink-600 dark:text-pink-400',
};

interface AIScholarship {
    name: string;
    provider: string;
    eligibility: string;
    amount: string;
}

interface Props {
    course: string;
    category: string;
    aiScholarships?: AIScholarship[];  // from Groq response
}

export const ScholarshipPanel: React.FC<Props> = ({ course, category, aiScholarships }) => {
    const [activeTab, setActiveTab] = useState<'ai' | 'portals'>('ai');

    const hasAI = aiScholarships && aiScholarships.length > 0;

    return (
        <div className="mt-8 md:mt-12">
            {/* Header */}
            <div className="flex items-center gap-3 mb-6">
                <div className="p-2.5 md:p-3 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl">
                    <Award size={20} className="text-emerald-600 dark:text-emerald-400 md:w-6 md:h-6" />
                </div>
                <div>
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Scholarship Analysis</h3>
                    <p className="text-soft dark:text-slate-400 text-xs md:text-sm">
                        Curated for <span className="text-indigo-600 dark:text-indigo-400 font-bold">"{course}"</span>
                    </p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex flex-wrap gap-2 md:gap-3 mb-6 md:mb-8 p-1 md:p-1.5 bg-slate-100 dark:bg-slate-900/50 rounded-2xl w-full sm:w-fit">
                <button
                    onClick={() => setActiveTab('ai')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all min-h-[40px] ${activeTab === 'ai'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    <GraduationCap size={14} className="md:w-4 md:h-4" />
                    AI Matched ({hasAI ? aiScholarships!.length : 0})
                </button>
                <button
                    onClick={() => setActiveTab('portals')}
                    className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 md:px-6 py-2 md:py-2.5 rounded-xl font-bold text-[10px] md:text-xs uppercase tracking-widest transition-all min-h-[40px] ${activeTab === 'portals'
                        ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm border border-slate-200 dark:border-slate-700'
                        : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                        }`}
                >
                    <Globe size={14} className="md:w-4 md:h-4" />
                    Official Portals
                </button>
            </div>

            {/* ── AI Scholarships tab ── */}
            {activeTab === 'ai' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {!hasAI ? (
                        <div className="col-span-full p-8 md:p-12 rounded-[2rem] bg-slate-50 dark:bg-slate-900/30 border border-slate-100 dark:border-slate-800 text-center">
                            <GraduationCap size={40} className="text-slate-200 dark:text-slate-800 mx-auto mb-4 md:w-12 md:h-12" />
                            <p className="text-slate-900 dark:text-white font-bold mb-2 text-sm md:text-base">No direct AI matches found</p>
                            <p className="text-soft dark:text-slate-500 text-xs md:text-sm max-w-xs mx-auto">
                                Check our official portals for all available government schemes.
                            </p>
                            <button
                                onClick={() => setActiveTab('portals')}
                                className="mt-6 px-8 py-3 rounded-xl text-xs md:text-sm font-bold bg-indigo-600 text-white hover:opacity-90 transition-all min-h-[44px]"
                            >
                                Browse Portals
                            </button>
                        </div>
                    ) : (
                        aiScholarships!.map((s, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: i * 0.1 }}
                                className="p-5 md:p-6 rounded-2xl md:rounded-3xl bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group"
                            >
                                <div className="flex items-start justify-between gap-4 mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl bg-indigo-50 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform">
                                            <Award size={18} className="md:w-5 md:h-5" />
                                        </div>
                                        <h4 className="text-slate-900 dark:text-white font-bold text-xs md:text-sm leading-snug">{s.name}</h4>
                                    </div>
                                    <span className="text-[9px] md:text-[10px] font-black text-white bg-emerald-500 px-2.5 py-1 rounded-full shadow-lg shadow-emerald-500/20 shrink-0">
                                        {s.amount}
                                    </span>
                                </div>
                                <div className="space-y-2">
                                    <p className="text-[10px] md:text-xs text-soft dark:text-slate-500">
                                        <span className="font-bold text-slate-600 dark:text-slate-400">Provider:</span> {s.provider}
                                    </p>
                                    <p className="text-[10px] md:text-xs text-soft dark:text-slate-500">
                                        <span className="font-bold text-slate-600 dark:text-slate-400">Eligibility:</span> {s.eligibility}
                                    </p>
                                </div>
                            </motion.div>
                        ))
                    )}
                </div>
            )}

            {/* ── Official Portals tab ── */}
            {activeTab === 'portals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {GOVT_SCHOLARSHIP_PORTALS.map((portal, i) => (
                        <motion.a
                            key={i}
                            href={portal.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="flex flex-col p-5 md:p-6 rounded-2xl md:rounded-3xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all group relative border-b-4 border-b-slate-200 dark:border-b-slate-700 hover:border-b-indigo-500"
                        >
                            <div className="flex items-center justify-between mb-4">
                                <span className={`text-[9px] md:text-[10px] font-black px-2.5 py-1 rounded-full border-2 ${colorMap[portal.color]} uppercase tracking-tighter`}>
                                    {portal.badge}
                                </span>
                                <ExternalLink size={14} className="text-slate-300 dark:text-slate-700 group-hover:text-indigo-500 transition-colors" />
                            </div>
                            <h4 className="text-xs md:text-sm text-slate-900 dark:text-white font-bold mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                {portal.name}
                            </h4>
                            <p className="text-soft dark:text-slate-500 text-[11px] md:text-xs leading-relaxed mb-4">{portal.description}</p>
                            <p className="text-indigo-600 dark:text-indigo-400 text-[9px] md:text-[10px] font-bold mt-auto truncate">{portal.link}</p>
                        </motion.a>
                    ))}
                </div>
            )}
        </div>
    );
};
