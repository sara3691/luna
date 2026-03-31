export type Stream = 'Science' | 'Commerce' | 'Arts' | 'Arts / Humanities' | '';

export interface UserData {
    educationBoard: string;
    stream: Stream;
    subjects: string;
    marks: number;
    gender: string;
    category: string;
    annualIncome: string;
    skills: string[];
    interests: {
        primary: string;
        other?: string;
    };
    location: {
        state: string;
        districts: string[];
        anywhereInIndia: boolean;
        studyAbroad: boolean;
    };
    selectedCourse: string; // Dynamic course chosen by user
}

export interface CareerRecommendation {
    id: string;
    title: string;
    description: string;
    eligibility: string;
    duration: string;
    averageSalary: string;
    topColleges: string[];
    careerPath: string[];
    tags: string[];
    scholarships?: ScholarshipResult[];
}

export interface ScholarshipResult {
    title: string;
    link: string;
    snippet: string;
    source?: string;
}

export interface CourseDetail {
    title: string;
    link: string;
    snippet: string;
    source?: string;
}

export interface StepProps {
    userData: UserData;
    updateUserData: (data: Partial<UserData>) => void;
    onNext: () => void;
    onBack: () => void;
}

export interface College {
    id: string;
    name: string;
    location: string;
    state: string;
    isAbroad: boolean;
    fees: string;
    cutoff: number;
    entranceExam?: string;
    tags: string[];
    courses: string[]; // List of courses offered
}

export type ChanceStatus = 'High Chance' | 'Medium Chance' | 'Low Chance';

export interface CollegeRecommendationResult extends College {
    chance: ChanceStatus;
}
