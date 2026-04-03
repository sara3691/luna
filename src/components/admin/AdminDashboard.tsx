import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Search, Download, Calendar, Mail, Phone, ChevronDown, 
  ChevronUp, User, LayoutDashboard, LogOut, ArrowLeft, Filter, 
  ExternalLink, Clock, Database, Globe, MapPin, Target, Sparkles, Building
} from 'lucide-react';
import { db } from '../../services/dbService';

interface AdminDashboardProps {
    onLogout: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
    const [data, setData] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await db.getAdminDashboardData();
            setData(result);
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Failed to fetch dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const toggleRow = (id: string) => {
        const newExpanded = new Set(expandedRows);
        if (newExpanded.has(id)) {
            newExpanded.delete(id);
        } else {
            newExpanded.add(id);
        }
        setExpandedRows(newExpanded);
    };

    const filteredData = data.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
    );

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col">
            {/* Admin Sidebar/Header */}
            <header className="sticky top-0 z-30 w-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-[1600px] mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-500/20">
                            <LayoutDashboard className="text-white w-6 h-6" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">Admin Terminal</h1>
                            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Career Compass Analytics</p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <button 
                            onClick={fetchData}
                            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                            title="Refresh Data"
                        >
                            <Clock className="w-5 h-5 text-slate-400" />
                        </button>
                        <button 
                            onClick={onLogout}
                            className="flex items-center gap-2 px-5 py-2.5 bg-red-50 dark:bg-red-950/30 text-red-600 dark:text-red-400 font-bold rounded-xl hover:bg-red-100 transition-all border border-red-100 dark:border-red-900/30"
                        >
                            <LogOut className="w-4 h-4" />
                            <span className="hidden sm:inline">Sign Out</span>
                        </button>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-[1600px] w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
                {/* Dashboard Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl flex items-center justify-center">
                                <Users className="text-indigo-600 dark:text-indigo-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">Total Users</p>
                                <p className="text-2xl font-black">{data.length}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl flex items-center justify-center">
                                <Database className="text-emerald-600 dark:text-emerald-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">Total Inputs</p>
                                <p className="text-2xl font-black">{data.reduce((acc, curr) => acc + (curr.inputs?.length || 0), 0)}</p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/20 rounded-2xl flex items-center justify-center">
                                <Sparkles className="text-purple-600 dark:text-purple-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">Active Today</p>
                                <p className="text-2xl font-black">
                                    {data.filter(u => new Date(u.createdAt).toDateString() === new Date().toDateString()).length}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="p-6 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-sm">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-amber-50 dark:bg-amber-900/20 rounded-2xl flex items-center justify-center">
                                <Globe className="text-amber-600 dark:text-amber-400 w-6 h-6" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-slate-500">Live Status</p>
                                <p className="text-2xl font-black text-emerald-500">Operational</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Table Section */}
                <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                    {/* Toolbar */}
                    <div className="p-6 sm:p-8 flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-50/50 dark:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
                        <div className="relative w-full sm:w-[400px]">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                            <input 
                                type="text"
                                placeholder="Search by name, email or phone..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all outline-none font-bold placeholder:text-slate-400"
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all">
                                <Filter className="w-4 h-4" />
                                <span>Filter</span>
                            </button>
                            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-5 py-3.5 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-500/20 transition-all">
                                <Download className="w-4 h-4" />
                                <span>Export Data</span>
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-x-auto">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="text-left border-b border-slate-200 dark:border-slate-800">
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest">User Profile</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest hidden md:table-cell">Contact Details</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest hidden lg:table-cell">Registered At</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-center">Inputs</th>
                                    <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-widest text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {loading ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4">
                                                <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                                                <p className="font-bold text-slate-500">Loading database...</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : filteredData.length === 0 ? (
                                    <tr>
                                        <td colSpan={5} className="px-8 py-20 text-center">
                                            <div className="flex flex-col items-center gap-4 opacity-50">
                                                <Search className="w-12 h-12" />
                                                <p className="font-bold text-slate-500">No matching users found.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    filteredData.map((user) => (
                                        <React.Fragment key={user._id}>
                                            <tr className={`group hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors border-b border-slate-100 dark:border-slate-800/50 ${expandedRows.has(user._id) ? 'bg-indigo-50/30 dark:bg-indigo-900/10' : ''}`}>
                                                <td className="px-8 py-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/10 flex items-center justify-center font-black text-indigo-600 dark:text-indigo-400">
                                                            {user.name?.[0].toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="font-black text-slate-900 dark:text-white">{user.name}</p>
                                                            <p className="text-xs font-bold text-slate-400 truncate max-w-[200px]">{user._id}</p>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 hidden md:table-cell">
                                                    <div className="space-y-1">
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                                            <Mail className="w-4 h-4 text-slate-400" />
                                                            {user.email}
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm font-bold text-slate-600 dark:text-slate-400">
                                                            <Phone className="w-4 h-4 text-slate-400" />
                                                            {user.phone || 'No phone'}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 hidden lg:table-cell">
                                                    <div className="flex items-center gap-2 text-sm font-bold text-slate-500">
                                                        <Calendar className="w-4 h-4 opacity-50" />
                                                        {formatDate(user.createdAt)}
                                                    </div>
                                                </td>
                                                <td className="px-8 py-6 text-center">
                                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-black ${user.inputs?.length > 0 ? 'bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'}`}>
                                                        {user.inputs?.length || 0} Records
                                                    </span>
                                                </td>
                                                <td className="px-8 py-6 text-right">
                                                    <button 
                                                        onClick={() => toggleRow(user._id)}
                                                        className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-bold text-sm hover:border-indigo-500 transition-all"
                                                    >
                                                        {expandedRows.has(user._id) ? (
                                                            <>
                                                                <ChevronUp className="w-4 h-4" />
                                                                <span>Show Less</span>
                                                            </>
                                                        ) : (
                                                            <>
                                                                <ChevronDown className="w-4 h-4" />
                                                                <span>Show More</span>
                                                            </>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                            <AnimatePresence>
                                                {expandedRows.has(user._id) && (
                                                    <tr>
                                                        <td colSpan={5} className="p-0">
                                                            <motion.div 
                                                                initial={{ height: 0, opacity: 0 }}
                                                                animate={{ height: 'auto', opacity: 1 }}
                                                                exit={{ height: 0, opacity: 0 }}
                                                                className="overflow-hidden"
                                                            >
                                                                <div className="px-8 py-10 bg-slate-50 dark:bg-slate-800/20 border-b border-slate-200 dark:border-slate-800 space-y-6">
                                                                    <div className="flex items-center gap-3 mb-6">
                                                                        <Database className="w-5 h-5 text-indigo-500" />
                                                                        <h3 className="text-lg font-black tracking-tight">{user.name}'s Search History</h3>
                                                                    </div>
                                                                    
                                                                    {user.inputs && user.inputs.length > 0 ? (
                                                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                            {user.inputs.map((input: any, idx: number) => (
                                                                                <div key={idx} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm group hover:border-indigo-500/50 transition-colors">
                                                                                    <div className="flex justify-between items-start mb-4 pb-4 border-b border-slate-100 dark:border-slate-800">
                                                                                        <div className="flex items-center gap-3">
                                                                                            <span className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 flex items-center justify-center font-black text-indigo-600 text-xs">{idx + 1}</span>
                                                                                            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest">
                                                                                                <Clock className="w-3 h-3" />
                                                                                                {formatDate(input.createdAt)}
                                                                                            </div>
                                                                                        </div>
                                                                                        <div className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-[10px] font-black rounded-md uppercase">
                                                                                            {input.source || 'Form Input'}
                                                                                        </div>
                                                                                    </div>
                                                                                    
                                                                                    <div className="space-y-4">
                                                                                        <div className="grid grid-cols-2 gap-x-8 gap-y-4">
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Marks</p>
                                                                                                <p className="font-bold text-slate-700 dark:text-slate-300">{input.marks || 'N/A'}%</p>
                                                                                            </div>
                                                                                            <div className="space-y-1">
                                                                                                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Location</p>
                                                                                                <p className="font-bold text-slate-700 dark:text-slate-300">{input.location || 'Anywhere'}</p>
                                                                                            </div>
                                                                                        </div>
                                                                                        
                                                                                        <div className="space-y-2">
                                                                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Interests & Preferences</p>
                                                                                            <div className="flex flex-wrap gap-2">
                                                                                                {input.preferences && input.preferences.length > 0 ? (
                                                                                                    input.preferences.map((p: string, i: number) => (
                                                                                                        <span key={i} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold">{p}</span>
                                                                                                    ))
                                                                                                ) : (
                                                                                                    <span className="text-xs font-bold text-slate-400 italic">No preferences selected</span>
                                                                                                )}
                                                                                            </div>
                                                                                        </div>

                                                                                        <div className="p-4 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
                                                                                            <p className="text-[10px] font-black text-indigo-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                                                                                <Target className="w-3 h-3" />
                                                                                                Primary Suggestion
                                                                                            </p>
                                                                                            <p className="font-bold text-slate-900 dark:text-white">
                                                                                                {Array.isArray(input.aiSuggestion) ? input.aiSuggestion[0]?.title : input.aiSuggestion?.title || 'No suggestion data'}
                                                                                            </p>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="py-12 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-[2rem] opacity-50">
                                                                            <ArrowLeft className="w-8 h-8 rotate-90 mb-4" />
                                                                            <p className="font-bold">No career inquiries registered yet.</p>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </motion.div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </AnimatePresence>
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                    
                    {/* Pagination Dummy */}
                    <div className="p-6 bg-slate-50/50 dark:bg-slate-800/30 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
                        <p className="text-xs font-bold text-slate-500 tracking-wide">Showing {filteredData.length} entries</p>
                        <div className="flex gap-2">
                            <button disabled className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase opacity-50">Prev</button>
                            <button className="px-4 py-2 bg-white dark:bg-slate-900 border border-indigo-500 text-indigo-600 rounded-xl text-xs font-black uppercase">1</button>
                            <button disabled className="px-4 py-2 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-black uppercase opacity-50">Next</button>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};
