import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Target, School, GraduationCap, Map, ClipboardList, Cpu, CheckCircle } from 'lucide-react';

interface HomepageProps {
    onStart: () => void;
}

export const Homepage: React.FC<HomepageProps> = ({ onStart }) => {
    return (
        <div className="flex flex-col -mt-24 md:-mt-32">
            {/* Hero Section */}
            <section className="py-20 md:py-40 px-4 bg-white dark:bg-slate-950 transition-colors duration-300 flex flex-col items-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8 }}
                    className="max-w-4xl text-center"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 text-[10px] md:text-sm font-bold mb-6">
                        <Star size={14} fill="currentColor" />
                        <span>#1 AI Career Advisor for Students</span>
                    </div>
                    <h1 className="text-4xl md:text-8xl font-extrabold text-slate-900 dark:text-white leading-tight mb-4 md:mb-8">
                        CAREER <span className="gradient-text">COMPASS</span>
                    </h1>
                    <p className="text-base md:text-2xl font-bold text-indigo-600 dark:text-indigo-400 mb-6 tracking-wide uppercase">
                        Guiding Your Path to Success
                    </p>
                    <p className="text-sm md:text-xl text-soft dark:text-slate-400 mb-10 md:mb-12 max-w-2xl leading-relaxed mx-auto">
                        Navigate the path to your future with confidence. Advanced AI provides personalized career, college, and scholarship recommendations tailored just for you.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                        <button
                            onClick={onStart}
                            className="btn-primary flex items-center justify-center gap-3 w-full sm:w-auto min-h-[50px] md:min-h-[60px]"
                        >
                            Start Assessment
                            <ArrowRight size={20} />
                        </button>
                        <a
                            href="#features"
                            className="px-8 py-3 text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors text-sm md:text-base border-b-2 border-transparent hover:border-indigo-600"
                        >
                            Explore Features
                        </a>
                    </div>
                </motion.div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-16 md:py-24 px-4 bg-slate-50 dark:bg-slate-900/50 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-5xl font-bold text-slate-900 dark:text-white mb-4">Brilliant Features</h2>
                        <p className="text-soft dark:text-slate-400 text-xs md:text-base">Everything you need to plan your academic journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8">
                        {[
                            { icon: <Target />, title: "Precision Guidance", desc: "AI-based suggestions tailored specifically to your strengths and profile." },
                            { icon: <School />, title: "Institution Matcher", desc: "Discover top-tier colleges in India and abroad matching your level." },
                            { icon: <GraduationCap />, title: "Scholarship Support", desc: "Smart filtering based on your category, income, and merits." },
                            { icon: <Map />, title: "Strategic Roadmap", desc: "Clear step-by-step navigation from results to your dream career." }
                        ].map((feature, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="corporate-card group p-5 md:p-8 flex items-start gap-4 md:gap-6"
                            >
                                <div className="feature-icon flex-shrink-0 group-hover:scale-110 transition-transform w-10 h-10 md:w-14 md:h-14">
                                    {React.cloneElement(feature.icon as React.ReactElement, { size: 20 })}
                                </div>
                                <div className="flex-1">
                                    <h3 className="text-base md:text-xl font-bold text-slate-900 dark:text-white mb-1.5">{feature.title}</h3>
                                    <p className="text-[11px] md:text-base text-soft dark:text-slate-400 leading-relaxed">{feature.desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 md:py-24 px-4 bg-white dark:bg-slate-950 transition-colors duration-300">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-10 md:mb-16">
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">How It Works</h2>
                        <p className="text-soft dark:text-slate-400 text-xs md:text-base">Your future, illuminated in three quick steps</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
                        {[
                            { step: "01", title: "Share Profile", desc: "Share your academic background and interests with our AI engine." },
                            { step: "02", title: "AI Deep Analysis", desc: "Our engine processes 10,000+ data points for valid opportunities." },
                            { step: "03", title: "Get Your Roadmap", desc: "Receive an actionable roadmap with colleges and direct links." }
                        ].map((s, i) => (
                            <div key={i} className="group text-center flex flex-col items-center">
                                <div className="step-number group-hover:scale-110 transition-transform duration-500 w-12 h-12 md:w-14 md:h-14 mb-4 md:mb-6 text-xl md:text-2xl">
                                    {s.step}
                                </div>
                                <h3 className="text-lg md:text-xl font-extrabold text-slate-900 dark:text-white mb-2 md:mb-3 uppercase tracking-tight md:tracking-normal">{s.title}</h3>
                                <p className="text-xs md:text-base text-soft dark:text-slate-400 leading-relaxed max-w-[220px] md:max-w-xs">{s.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Results CTA */}
            <section className="py-12 md:py-24 px-6 md:px-4 bg-indigo-600 rounded-[2rem] md:rounded-[3rem] mx-4 mb-12 md:mb-20 overflow-hidden relative shadow-2xl">
                <div className="absolute top-0 right-0 w-48 md:w-96 h-48 md:h-96 bg-white opacity-5 rounded-full -mr-12 -mt-12 md:-mr-20 md:-mt-20"></div>

                <div className="max-w-4xl mx-auto text-center relative z-10 text-white">
                    <h2 className="text-2xl md:text-5xl font-extrabold mb-4 md:mb-8 tracking-tight leading-tight">Ready to illuminate your potential?</h2>
                    <p className="text-indigo-100 text-sm md:text-lg mb-8 md:mb-12 max-w-2xl mx-auto leading-relaxed opacity-90">
                        Join 2,000+ students charting their academic journey with CAREER COMPASS.
                    </p>
                    <button
                        onClick={onStart}
                        className="w-full sm:w-auto px-10 py-4 md:px-12 md:py-5 bg-white text-indigo-600 hover:bg-slate-50 transition-all font-bold rounded-xl md:rounded-2xl shadow-xl active:scale-95 text-sm md:text-base min-h-[50px]"
                    >
                        Start Your Assessment
                    </button>
                    <div className="mt-8 flex items-center justify-center gap-2 md:gap-6 opacity-70">
                        <CheckCircle size={14} className="text-indigo-200" />
                        <span className="text-[10px] md:text-sm font-medium">Free for 2024–25 Batch</span>
                    </div>
                </div>
            </section>
        </div>
    );
};
