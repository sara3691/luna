import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lock, User, ArrowRight, ShieldCheck, AlertCircle, LayoutDashboard, Sparkles } from 'lucide-react';
import { db } from '../../services/dbService';

interface AdminLoginProps {
    onLogin: (adminData: any) => void;
    onBack: () => void;
}

export const AdminLogin: React.FC<AdminLoginProps> = ({ onLogin, onBack }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const adminData = await db.adminLogin({ username, password });
            onLogin(adminData);
        } catch (err: any) {
            setError(err.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 bg-[#F8FAFC] dark:bg-[#020617] relative overflow-hidden">
            {/* Visual background elements */}
            <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] animate-pulse" />
            <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '3s' }} />

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md z-10"
            >
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-2xl p-8 sm:p-12">
                    <div className="text-center mb-10">
                        <div className="w-16 h-16 bg-slate-900 dark:bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl shadow-slate-200 dark:shadow-none">
                            <ShieldCheck className="text-white dark:text-slate-900 w-8 h-8" />
                        </div>
                        <h1 className="text-3xl font-black tracking-tight text-slate-900 dark:text-white mb-2 underline decoration-indigo-500 underline-offset-8">Admin Access</h1>
                        <p className="text-sm font-bold text-slate-500 mt-4 uppercase tracking-[0.2em]">Secure Authentication Required</p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 dark:bg-red-950/20 border border-red-100 dark:border-red-900/30 rounded-2xl flex items-center gap-3 text-red-600 dark:text-red-400 text-sm font-bold animate-shake">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Terminal ID</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 group-focus-within:bg-indigo-50 dark:group-focus-within:bg-indigo-900/30 rounded-xl transition-colors">
                                    <User className="text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
                                </div>
                                <input 
                                    type="text" 
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-16 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" 
                                    placeholder="Username"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">Secret Key</label>
                            <div className="relative group">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center bg-slate-100 dark:bg-slate-800 group-focus-within:bg-indigo-50 dark:group-focus-within:bg-indigo-900/30 rounded-xl transition-colors">
                                    <Lock className="text-slate-400 group-focus-within:text-indigo-500 w-5 h-5 transition-colors" />
                                </div>
                                <input 
                                    type="password" 
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-16 pr-6 py-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-bold" 
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-8 py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black rounded-2xl shadow-xl hover:bg-slate-800 dark:hover:bg-slate-100 transition-all active:scale-[0.98] flex items-center justify-center gap-3 uppercase tracking-widest text-sm disabled:opacity-50"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-slate-400 border-t-white dark:border-t-slate-900 rounded-full animate-spin" />
                            ) : (
                                <>
                                    <span>Initialize Session</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <button 
                        onClick={onBack}
                        className="w-full mt-8 text-xs font-black text-slate-400 dark:text-slate-600 uppercase tracking-[0.2em] hover:text-indigo-500 transition-colors"
                    >
                        Return to Dashboard
                    </button>
                </div>
                
                <div className="mt-8 flex items-center justify-center gap-2 text-slate-400 dark:text-slate-600 font-bold text-xs uppercase tracking-widest">
                    <LayoutDashboard className="w-3 h-3" />
                    <span>LUNA V2.5.0-ADMIN</span>
                </div>
            </motion.div>
        </div>
    );
};
