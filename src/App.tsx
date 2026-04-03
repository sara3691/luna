import { useState, useEffect } from 'react';
import { UserData, CareerRecommendation } from './types';
import { COURSES_DATA } from './constants';
import { getCareerRecommendations } from './services/groqService';
import { Homepage } from './components/steps/Homepage';
import { AcademicDetails } from './components/steps/AcademicDetails';
import { SkillsAssessment } from './components/steps/SkillsAssessment';
import { InterestSelection } from './components/steps/InterestSelection';
import { LocationPreference } from './components/steps/LocationPreference';
import { CareerRecommendations } from './components/results/CareerRecommendations';
import { CollegeRecommendations } from './components/results/CollegeRecommendations';
import { CareerDetailsModal } from './components/results/CareerDetailsModal';
import { getCollegeRecommendations } from './services/collegeService';
import { getGroqCollegeRecommendations } from './services/groqService';
import { Stepper } from './components/ui/Stepper';
import { motion, AnimatePresence } from 'framer-motion';
import { db } from './services/dbService';
import { Loader2, Zap, Moon, Sun, Menu, X as CloseIcon, User } from 'lucide-react';
import { Login } from './components/auth/Login';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';

const initialUserData: UserData = {
    educationBoard: '',
    stream: 'Science',
    subjects: '',
    marks: 0,
    gender: '',
    category: '',
    annualIncome: '',
    skills: [],
    interests: { primary: '' },
    location: {
        state: '',
        districts: [],
        anywhereInIndia: true,
        studyAbroad: false,
    },
    selectedCourse: '',
};

// Steps: 0=Home, 1=Academic, 2=Skills, 3=Interests, 4=Location, 5=Results
const TOTAL_FORM_STEPS = 4;

function App() {
    const [step, setStep] = useState(-1);
    const [user, setUser] = useState<any>(null);
    const [userData, setUserData] = useState<UserData>(initialUserData);
    const [loading, setLoading] = useState(false);
    const [loadingMsg, setLoadingMsg] = useState('Analyzing your profile...');
    const [recommendations, setRecommendations] = useState<CareerRecommendation[]>([]);
    const [isFallback, setIsFallback] = useState(false);
    const [selectedCareer, setSelectedCareer] = useState<CareerRecommendation | null>(null);
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        const saved = localStorage.getItem('theme');
        return (saved as 'light' | 'dark') || 'light';
    });
    const [collegeRecommendations, setCollegeRecommendations] = useState<any[]>([]);
    const [collegesLoading, setCollegesLoading] = useState(false);
    const [collegesError, setCollegesError] = useState<string | null>(null);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isAdminMode, setIsAdminMode] = useState(false);
    const [adminUser, setAdminUser] = useState<any>(null);

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    useEffect(() => {
        const fetchColleges = async () => {
            if (step === 5 && userData.selectedCourse) {
                setCollegesLoading(true);
                setCollegesError(null);
                try {
                    const results = await getGroqCollegeRecommendations(
                        userData.selectedCourse,
                        userData.location.state,
                        userData.location.anywhereInIndia,
                        userData.marks,
                        userData.stream,
                        userData.subjects
                    );
                    setCollegeRecommendations(results);
                } catch (err: any) {
                    console.error('Failed to fetch colleges:', err);
                    setCollegesError(err.message || 'Failed to fetch college recommendations');
                    // Fallback to static if needed, or just show error
                    setCollegeRecommendations(getCollegeRecommendations(userData));
                } finally {
                    setCollegesLoading(false);
                }
            }
        };

        fetchColleges();
    }, [step, userData.selectedCourse, userData.marks, userData.location.state, userData.location.anywhereInIndia, userData.stream, userData.subjects]);

    const toggleTheme = () => setTheme(prev => prev === 'light' ? 'dark' : 'light');

    const updateUserData = (data: Partial<UserData>) => {
        setUserData(prev => ({ ...prev, ...data }));
    };

    const handleNext = () => {
        setStep(prev => prev + 1);
        setIsMenuOpen(false);
    };
    const handleBack = () => setStep(prev => prev - 1);

    const getStaticRecommendations = (data: UserData): CareerRecommendation[] => {
        return COURSES_DATA.filter(course => {
            if (data.stream === 'Science') return course.tags.includes('Science') || course.tags.includes('Tech');
            if (data.stream === 'Commerce') return course.tags.includes('Commerce') || course.tags.includes('Finance');
            if (data.stream === 'Arts') return course.tags.includes('Arts') || course.tags.includes('Design');
            return true;
        }).slice(0, 4);
    };

    const handleSubmit = async () => {
        setLoading(true);
        const loadingMessages = [
            '🤖 AI is analyzing your profile...',
            '📚 Finding best career paths for you...',
            '🏆 Matching scholarships & opportunities...',
            '✨ Almost done, preparing your results...',
        ];
        let msgIndex = 0;
        setLoadingMsg(loadingMessages[0]);
        const msgInterval = setInterval(() => {
            msgIndex = (msgIndex + 1) % loadingMessages.length;
            setLoadingMsg(loadingMessages[msgIndex]);
        }, 2500);

        try {
            const results = await getCareerRecommendations(userData);
            if (!results || !Array.isArray(results) || results.length === 0) {
                throw new Error('Invalid or empty recommendations');
            }
            setRecommendations(results);
            if (results.length > 0) {
                setUserData(prev => ({ ...prev, selectedCourse: results[0].title }));
                // Save to Database if user is logged in
                if (user?.email) {
                    db.saveCareerAssessment(user.email, {
                        recommendations: results,
                        profile: userData
                    }).catch(err => console.error("Failed to save assessment:", err));
                }
            }
            setIsFallback(false);
            setStep(5);
        } catch (error) {
            console.error('AI failed, switching to static engine:', error);
            const staticResults = getStaticRecommendations(userData);
            setRecommendations(staticResults);
            if (staticResults.length > 0) {
                setUserData(prev => ({ ...prev, selectedCourse: staticResults[0].title }));
            }
            setIsFallback(true);
            setStep(5);
        } finally {
            clearInterval(msgInterval);
            setLoading(false);
        }
    };

    const handleRestart = () => {
        setStep(0);
        setUserData(initialUserData);
        setRecommendations([]);
        setIsFallback(false);
        setIsMenuOpen(false);
    };

    return (
        <div className="min-h-screen font-sans selection:bg-indigo-100 selection:text-indigo-900 transition-colors duration-300 overflow-x-hidden">
            {/* Header / Navbar */}
            <header className="sticky-nav py-3 md:py-4 px-4 md:px-12 flex justify-between items-center backdrop-blur-md">
                <div className="flex items-center cursor-pointer" onClick={() => { handleRestart(); setIsMenuOpen(false); }}>
                    <img
                        src={theme === 'light' ? "/luna_light.png" : "/luna_dark.png"}
                        className="h-10 md:h-11 w-auto object-contain transition-all duration-300"
                        alt="Career Compass"
                    />
                    <span className="hidden md:block ml-3 text-xl font-black gradient-text">Career Compass</span>
                </div>

                <nav className="flex items-center gap-2 md:gap-10">
                    <div className="hidden md:flex items-center gap-8 mr-4">
                        <a href="#" className="font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">Home</a>
                        <a href="#features" className="font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">Features</a>
                        <a href="#" className="font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 transition-colors">About</a>
                    </div>

                    {user && (
                        <div className="hidden lg:flex items-center gap-3 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl mr-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs">
                                {user.name?.[0].toUpperCase()}
                            </div>
                            <span className="text-sm font-bold text-slate-700 dark:text-slate-300">{user.name}</span>
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <button
                            onClick={toggleTheme}
                            className="p-2 md:p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700"
                            title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
                        >
                            {theme === 'light' ? <Moon size={18} className="md:w-5 md:h-5" /> : <Sun size={18} className="md:w-5 md:h-5" />}
                        </button>

                        <button
                            onClick={() => { if (step === 0) handleNext() }}
                            className="hidden md:block px-6 py-2.5 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-all shadow-md shadow-indigo-200 dark:shadow-none"
                        >
                            Get Started
                        </button>

                        <button
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                            className="md:hidden p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700"
                        >
                            {isMenuOpen ? <CloseIcon size={20} /> : <Menu size={20} />}
                        </button>
                    </div>
                </nav>

                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 p-6 md:hidden shadow-2xl flex flex-col gap-2 overflow-hidden z-[100]"
                        >
                            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Home</a>
                            <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">Features</a>
                            <a href="#" onClick={() => setIsMenuOpen(false)} className="text-base font-bold text-slate-700 dark:text-slate-300 py-3 px-4 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">About</a>
                            <div className="h-px bg-slate-100 dark:bg-slate-800 my-2 mx-4" />
                            <button
                                onClick={() => { if (step === 0) handleNext(); setIsMenuOpen(false); }}
                                className="mt-2 w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl shadow-lg active:scale-95 transition-transform"
                            >
                                Start Assessment
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </header>

            <main className="pt-24 md:pt-32 pb-10 md:pb-20">
                {isAdminMode ? (
                    adminUser ? (
                        <AdminDashboard onLogout={() => { setAdminUser(null); setIsAdminMode(false); }} />
                    ) : (
                        <AdminLogin 
                            onLogin={(data) => setAdminUser(data)} 
                            onBack={() => setIsAdminMode(false)} 
                        />
                    )
                ) : loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4 space-y-8">
                        <div className="relative">
                            <div className="w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center">
                                <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
                            </div>
                            <div className="absolute inset-0 rounded-full animate-ping bg-indigo-600/10" />
                        </div>
                        <div className="text-center animate-pulse">
                            <h3 className="text-2xl font-bold mb-2">Analyzing Profile</h3>
                            <p className="text-slate-500 font-medium">{loadingMsg}</p>
                        </div>
                    </div>
                ) : (
                    <AnimatePresence mode="wait">
                        {/* Auth Step */}
                        {step === -1 && (
                            <Login 
                                key="login" 
                                onLogin={(u) => { setUser(u); setStep(0); }} 
                                onSkip={() => setStep(0)} 
                            />
                        )}

                        {/* Step 0: Homepage */}
                        {step === 0 && <Homepage key="home" onStart={handleNext} />}

                        {/* Steps 1–4: Form Steps */}
                        {step > 0 && step < 5 && (
                            <motion.div
                                key="form"
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.98 }}
                                transition={{ duration: 0.4 }}
                                className="max-w-4xl mx-auto px-4"
                            >
                                <div className="mb-12">
                                    <Stepper currentStep={step} totalSteps={TOTAL_FORM_STEPS} />
                                </div>

                                {step === 1 && (
                                    <AcademicDetails
                                        userData={userData}
                                        updateUserData={updateUserData}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                    />
                                )}
                                {step === 2 && (
                                    <SkillsAssessment
                                        userData={userData}
                                        updateUserData={updateUserData}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                    />
                                )}
                                {step === 3 && (
                                    <InterestSelection
                                        userData={userData}
                                        updateUserData={updateUserData}
                                        onNext={handleNext}
                                        onBack={handleBack}
                                    />
                                )}
                                {step === 4 && (
                                    <LocationPreference
                                        userData={userData}
                                        updateUserData={updateUserData}
                                        onNext={handleSubmit}
                                        onBack={handleBack}
                                    />
                                )}
                            </motion.div>
                        )}

                        {/* Step 5: Results */}
                        {step === 5 && (
                            <div className="max-w-7xl mx-auto px-4">
                                <CareerRecommendations
                                    key="results"
                                    recommendations={recommendations}
                                    isFallback={isFallback}
                                    onRestart={handleRestart}
                                    onSelect={(rec) => {
                                        setSelectedCareer(rec);
                                        updateUserData({ selectedCourse: rec.title });
                                    }}
                                />

                                <CollegeRecommendations
                                    recommendations={collegeRecommendations}
                                    selectedCourse={userData.selectedCourse}
                                    isLoading={collegesLoading}
                                    error={collegesError || undefined}
                                />
                            </div>
                        )}
                    </AnimatePresence>
                )}
            </main>

            <CareerDetailsModal
                recommendation={selectedCareer}
                userData={userData}
                onClose={() => setSelectedCareer(null)}
            />

            <footer className="py-16 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-4">
                        <div className="flex items-center">
                            <span className="text-xl font-black text-white">Career Compass</span>
                        </div>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            Empowering students through intelligent AI-driven career guidance and academic roadmaps.
                        </p>
                    </div>
                    <div className="flex flex-col gap-3">
                        <h4 className="font-bold mb-2">Quick Links</h4>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">Home</a>
                        <a href="#features" className="text-slate-400 hover:text-white transition-colors">Features</a>
                        <a href="#" className="text-slate-400 hover:text-white transition-colors">About</a>
                    </div>
                    <div className="text-right flex flex-col items-center md:items-end justify-center">
                        <p className="text-slate-400 text-sm mb-2">© {new Date().getFullYear()} CAREER COMPASS</p>
                        <button 
                            onClick={() => setIsAdminMode(true)}
                            className="text-xs text-slate-500 italic hover:text-indigo-400 transition-colors"
                        >
                            Designed with precision for future leaders.
                        </button>
                    </div>
                </div>
            </footer>
        </div>
    );
}


export default App;
