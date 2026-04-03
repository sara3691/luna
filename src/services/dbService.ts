import { createClient } from '@supabase/supabase-js';

// Load environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Initialize Supabase client (only if credentials exist)
const supabase = (supabaseUrl && supabaseAnonKey) 
    ? createClient(supabaseUrl, supabaseAnonKey) 
    : null;

// Backend API URL
const BACKEND_URL = 'https://luna-e7l4.onrender.com/api';

// Helper for backend calls (Silent failure to maintain UI stability)
const callBackend = async (endpoint: string, method: string, data: any = {}) => {
    try {
        const response = await fetch(`${BACKEND_URL}${endpoint}`, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        return await response.json();
    } catch (error) {
        console.warn(`[Backend ${endpoint}] silent skip:`, error);
        return null;
    }
};

// Mock database using LocalStorage (fallback for when Supabase is not configured)
const mockDb = {
    saveProfile: async (email: string, name: string) => {
        const users = JSON.parse(localStorage.getItem('cc_users') || '[]');
        const existingIndex = users.findIndex((u: any) => u.email === email);
        if (existingIndex === -1) {
            users.push({ email, name, createdAt: new Date().toISOString() });
        } else {
            users[existingIndex] = { ...users[existingIndex], name, updatedAt: new Date().toISOString() };
        }
        localStorage.setItem('cc_users', JSON.stringify(users));
        return { success: true, user: users.find((u: any) => u.email === email) };
    },
    registerUser: async (userData: any) => {
        const users = JSON.parse(localStorage.getItem('cc_users') || '[]');
        const existing = users.find((u: any) => u.email === userData.email);
        
        if (existing) {
            throw new Error("User with this email already exists");
        }

        const newUser = {
            ...userData,
            id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
            createdAt: new Date().toISOString()
        };

        users.push(newUser);
        localStorage.setItem('cc_users', JSON.stringify(users));
        return newUser;
    },
    loginUser: async (email: string, password: string) => {
        const users = JSON.parse(localStorage.getItem('cc_users') || '[]');
        const user = users.find((u: any) => u.email === email);
        if (!user) throw new Error('No account found with this email. Please register first.');
        if (user.password !== password) throw new Error('Incorrect password. Please try again.');
        return user;
    },
    saveAssessment: async (email: string, results: any) => {
        const assessments = JSON.parse(localStorage.getItem('cc_assessments') || '[]');
        assessments.push({ email, results, timestamp: new Date().toISOString() });
        localStorage.setItem('cc_assessments', JSON.stringify(assessments));
        return { success: true };
    },
    getAssessments: async (email: string) => {
        const assessments = JSON.parse(localStorage.getItem('cc_assessments') || '[]');
        return assessments.filter((a: any) => a.email === email);
    }
};

export const db = {
    /**
     * Registers a new user with extended details
     */
    registerUser: async (userData: any) => {
        // Attempt backend registration - check if user exists first
        const backendResult = await callBackend('/register', 'POST', userData);
        // If backend is available and returned an error, throw it
        if (backendResult === null) {
            // Backend unavailable, fall through to localStorage
        }

        if (supabase) {
            const { data, error } = await supabase
                .from('profiles')
                .insert([{ 
                    email: userData.email, 
                    full_name: userData.name, 
                    phone: userData.phone,
                    created_at: new Date() 
                }]);
            if (error) throw error;
            return { ...userData, ...(Array.isArray(data) ? data[0] : (data || {})) };
        }
        // LocalStorage fallback
        return mockDb.registerUser(userData);
    },

    /**
     * Authenticates a user by verifying password against backend
     */
    loginUser: async (email: string, password: string) => {
        // Try backend authentication first
        try {
            const response = await fetch(`${BACKEND_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Invalid email or password.');
            }
            return data; // { name, email }
        } catch (error: any) {
            // If backend is unreachable, fallback to localStorage
            if (error.message.includes('fetch')) {
                return mockDb.loginUser(email, password);
            }
            throw error;
        }
    },

    /**
     * Updates/Saves user local profile metadata.
     * This is separate from the career data inputs.
     */
    saveUser: async (email: string, name: string) => {
        // We removed callBackend('/save-input', ...) to keep collections distinct.
        // Login and Registration are handled by specific endpoints.

        if (supabase) {
            const { data, error } = await supabase
                .from('profiles')
                .upsert({ email, full_name: name, updated_at: new Date() }, { onConflict: 'email' });
            if (error) throw error;
            return data;
        }
        return mockDb.saveProfile(email, name);
    },

    /**
     * Saves the career assessment results for a user (Only when logged in)
     */
    saveCareerAssessment: async (email: string, results: any) => {
        // Data extraction safely from nested results object
        const profile = results.profile || results;
        const marksValue = String(profile.marks || profile.examInfo?.marks || 'N/A');
        const locationValue = String(profile.location?.state || profile.location || 'Standard');

        // This is where real data from the web page is saved to the 'inputs' collection.
        // It requires the email of the logged-in user to maintain the relationship.
        callBackend('/save-input', 'POST', {
            email,
            name: profile.name || undefined,
            marks: marksValue,
            location: locationValue,
            preferences: profile.interests?.primary ? [profile.interests.primary] : (profile.preferences || profile.selections || []),
            aiSuggestion: results.recommendations || results.aiSuggestion || results,
            source: 'Career Compass Form Submission'
        });

        if (supabase) {
            const { data, error } = await supabase
                .from('assessments')
                .insert({ user_email: email, assessment_data: results, created_at: new Date() });
            if (error) throw error;
            return data;
        }
        return mockDb.saveAssessment(email, results);
    },

    /**
     * Authenticates an admin
     */
    adminLogin: async (credentials: any) => {
        const response = await fetch(`${BACKEND_URL}/admin/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(credentials)
        });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || 'Invalid admin credentials');
        return data; // { isAdmin: true, user: { name, role } }
    },

    /**
     * Fetches all user data linked with their career inputs for admin view
     */
    getAdminDashboardData: async () => {
        const response = await fetch(`${BACKEND_URL}/admin/dashboard`, {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });
        if (!response.ok) throw new Error('Failed to fetch admin dashboard data');
        return await response.json();
    }
};
