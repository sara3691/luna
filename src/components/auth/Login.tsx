import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, ArrowRight, Sparkles, AlertCircle, ChevronLeft } from 'lucide-react';
import { db } from '../../services/dbService';

interface LoginProps {
    onLogin: (user: any) => void;
    onSkip: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin, onSkip }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Form fields
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // ── Frontend Validation ──────────────────────────────────
        if (!email.trim()) {
            setError("Please enter your email address.");
            setLoading(false);
            return;
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            setError("Please enter a valid email address.");
            setLoading(false);
            return;
        }
        if (!password || password.length < 6) {
            setError("Password must be at least 6 characters.");
            setLoading(false);
            return;
        }
        if (!isLogin) {
            if (!name.trim()) {
                setError("Please enter your full name.");
                setLoading(false);
                return;
            }
            if (password !== confirmPassword) {
                setError("Passwords do not match.");
                setLoading(false);
                return;
            }
            if (phone && !/^\d{10}$/.test(phone)) {
                setError("Please enter a valid 10-digit mobile number.");
                setLoading(false);
                return;
            }
        }

        try {
            if (isLogin) {
                // ✅ Properly authenticate — checks email/password against backend
                const userData = await db.loginUser(email, password);
                // Also silently log the login activity
                db.saveUser(email, userData.name || email.split('@')[0]);
                onLogin({ email, name: userData.name || email.split('@')[0], ...userData });
            } else {
                // Register new user
                const userData = await db.registerUser({ name, email, phone, password });
                onLogin(userData);
            }
            setLoading(false);
        } catch (error: any) {
            console.error('Auth Error:', error);
            setError(error.message || "An error occurred. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center px-4 py-12 relative overflow-hidden bg-slate-50 dark:bg-[#020617]">
            {/* Professional Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] bg-purple-500/5 dark:bg-purple-500/10 rounded-full blur-[120px] pointer-events-none animate-pulse" style={{ animationDelay: '2s' }} />
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay"></div>
            </div>
            
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-5xl z-10 grid md:grid-cols-2 bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-[0_32px_64px_-12px_rgba(0,0,0,0.1)] dark:shadow-[0_32px_64px_-12px_rgba(0,0,0,0.5)] overflow-hidden border border-slate-100 dark:border-slate-800"
            >
                {/* Left Side: Branding/Content */}
                <div className="relative hidden md:flex flex-col justify-between p-12 bg-indigo-600 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-indigo-500 to-purple-600"></div>
                    
                    {/* Animated Shapes for Left Side */}
                    <motion.div 
                        animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 90, 0]
                        }}
                        transition={{ duration: 20, repeat: Infinity }}
                        className="absolute top-[-10%] right-[-10%] w-64 h-64 bg-white/10 rounded-full blur-3xl"
                    />
                    
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-12">
                            <Sparkles className="text-white w-4 h-4" />
                            <span className="text-white text-xs font-bold tracking-widest uppercase">Career Navigator</span>
                        </div>
                        
                        <h2 className="text-5xl font-black text-white leading-tight mb-6">
                            Unlock Your <br />
                            <span className="text-indigo-200">Professional</span> <br />
                            Potential.
                        </h2>
                        <p className="text-indigo-100 text-lg font-medium opacity-80 max-w-sm">
                            Join thousands of professionals using Career Compass to navigate their future.
                        </p>
                    </div>

                    <div className="relative z-10 flex gap-4 mt-auto">
                        <div className="w-12 h-1 bg-white/30 rounded-full overflow-hidden">
                            <motion.div 
                                animate={{ x: [-48, 48] }}
                                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                                className="w-1/2 h-full bg-white"
                            />
                        </div>
                        <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                        <div className="w-12 h-1 bg-white/10 rounded-full"></div>
                    </div>
                </div>

                {/* Right Side: Form */}
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <div className="flex md:hidden justify-center mb-6">
                            <div className="w-12 h-12 rounded-2xl bg-indigo-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
                                <Sparkles className="text-white w-6 h-6" />
                            </div>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
                            {isLogin ? 'Sign In' : 'Get Started'}
                        </h1>
                        <p className="text-slate-500 dark:text-slate-400 font-medium">
                            {isLogin ? 'Enter your details to access your account' : 'Fill in the information below to register'}
                        </p>
                    </div>

                    <AnimatePresence mode="wait">
                        {error && (
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800/30 rounded-xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold shadow-sm"
                            >
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                {error}
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="grid gap-4"
                            >
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Name</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-focus-within:bg-indigo-50 dark:group-focus-within:bg-indigo-900/30 rounded-lg transition-colors border border-transparent group-focus-within:border-indigo-100 dark:group-focus-within:border-indigo-800">
                                            <User className="text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
                                        </div>
                                        <input 
                                            type="text" 
                                            required
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full pl-16 pr-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700" 
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Phone</label>
                                    <div className="relative group">
                                        <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-focus-within:bg-indigo-50 dark:group-focus-within:bg-indigo-900/30 rounded-lg transition-colors border border-transparent group-focus-within:border-indigo-100 dark:group-focus-within:border-indigo-800">
                                            <Phone className="text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
                                        </div>
                                        <input 
                                            type="tel" 
                                            required
                                            value={phone}
                                            onChange={(e) => setPhone(e.target.value)}
                                            className="w-full pl-16 pr-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700" 
                                            placeholder="1234567890"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        <div className="space-y-1.5">
                            <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Email</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-focus-within:bg-indigo-50 dark:group-focus-within:bg-indigo-900/30 rounded-lg transition-colors border border-transparent group-focus-within:border-indigo-100 dark:group-focus-within:border-indigo-800">
                                    <Mail className="text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
                                </div>
                                <input 
                                    type="email" 
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-16 pr-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700" 
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className="flex justify-between items-center ml-1">
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">Password</label>
                                {isLogin && (
                                    <a href="#" className="text-[10px] font-black text-indigo-500 uppercase tracking-wider hover:text-indigo-600 transition-colors">Forgot?</a>
                                )}
                            </div>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-focus-within:bg-indigo-50 dark:group-focus-within:bg-indigo-900/30 rounded-lg transition-colors border border-transparent group-focus-within:border-indigo-100 dark:group-focus-within:border-indigo-800">
                                    <Lock className="text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-16 pr-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700" 
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        {!isLogin && (
                            <motion.div 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                className="space-y-1.5"
                            >
                                <label className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-slate-50 dark:bg-slate-800 group-focus-within:bg-indigo-50 dark:group-focus-within:bg-indigo-900/30 rounded-lg transition-colors border border-transparent group-focus-within:border-indigo-100 dark:group-focus-within:border-indigo-800">
                                        <Lock className="text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
                                    </div>
                                    <input 
                                        type="password" 
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        className="w-full pl-16 pr-6 py-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold placeholder:text-slate-300 dark:placeholder:text-slate-700" 
                                        placeholder="••••••••"
                                    />
                                </div>
                            </motion.div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>{isLogin ? 'Sign In' : 'Create My Account'}</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-8 text-center">
                        <button 
                            onClick={() => {
                                setIsLogin(!isLogin);
                                setError(null);
                            }}
                            className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-500 hover:text-indigo-500 transition-colors"
                        >
                            <span>{isLogin ? "New here?" : "Already have an account?"}</span>
                            <span className="text-indigo-600 underline underline-offset-4">{isLogin ? 'Create an account' : 'Sign In instead'}</span>
                        </button>
                    </div>

                    <div className="mt-8 pt-8 border-t border-slate-100 dark:border-slate-800 flex justify-center">
                        <button 
                            onClick={onSkip}
                            className="flex items-center gap-2 text-[10px] font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] hover:text-indigo-500 transition-colors"
                        >
                            Skip for now
                            <ChevronLeft className="w-3 h-3 rotate-180" />
                        </button>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};
