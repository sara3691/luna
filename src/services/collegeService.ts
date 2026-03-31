import { UserData, CollegeRecommendationResult, ChanceStatus } from '../types';
import { COLLEGES_DATA } from '../constants';

// Mapping of career keywords/titles to relevant college degrees
const CAREER_TO_COURSE_MAP: Record<string, string[]> = {
    'tech': ['B.Tech Computer Science', 'Data Science', 'B.Tech IT', 'B.Tech ECE'],
    'software': ['B.Tech Computer Science', 'Data Science'],
    'developer': ['B.Tech Computer Science', 'B.Tech IT'],
    'engineer': ['B.Tech Computer Science', 'B.Tech Electrical', 'B.Tech Mechanical', 'B.Tech ECE'],
    'doctor': ['MBBS'],
    'mbbs': ['MBBS'],
    'surgeon': ['MBBS'],
    'physician': ['MBBS'],
    'medical': ['MBBS', 'B.Pharma'],
    'business': ['BBA', 'B.Com (Hons)', 'B.A. Economics (Hons)'],
    'management': ['BBA', 'B.Com (Hons)'],
    'finance': ['B.Com (Hons)', 'B.A. Economics (Hons)'],
    'designer': ['Bachelor of Design (B.Des)'],
    'creative': ['Bachelor of Design (B.Des)', 'B.A. Psychology'],
    'scientist': ['B.Tech Computer Science', 'Data Science', 'MBBS'],
    'psychology': ['B.A. Psychology'],
    'economist': ['B.A. Economics (Hons)', 'B.Com (Hons)']
};

export function getCollegeRecommendations(userData: UserData): CollegeRecommendationResult[] {
    const { marks, selectedCourse, location } = userData;

    if (!selectedCourse) return [];

    // 1. Resolve relevant degrees from the selected career/course
    const careerLower = selectedCourse.toLowerCase();
    const relevantDegrees = new Set<string>();

    // Add exact matches if any
    relevantDegrees.add(careerLower);

    // Add mapped degrees based on keywords
    Object.entries(CAREER_TO_COURSE_MAP).forEach(([keyword, degrees]) => {
        if (careerLower.includes(keyword)) {
            degrees.forEach(d => relevantDegrees.add(d.toLowerCase()));
        }
    });

    // 2. Filter COLLEGES_DATA
    let filtered = COLLEGES_DATA.filter(college => {
        // Match Course
        const hasRelevantCourse = college.courses.some(c =>
            Array.from(relevantDegrees).some(rd =>
                c.toLowerCase().includes(rd) || rd.includes(c.toLowerCase())
            )
        );
        if (!hasRelevantCourse) return false;

        // Match Location
        if (location.studyAbroad) {
            return college.isAbroad;
        } else if (!location.anywhereInIndia && location.state) {
            return !college.isAbroad && college.state.toLowerCase() === location.state.toLowerCase();
        } else {
            // Anywhere in India
            return !college.isAbroad;
        }
    });

    // 3. Assign Chance based on Cutoff
    return filtered.map(college => {
        let chance: ChanceStatus = 'Low Chance';

        // Premium logic: If marks are above cutoff = High
        // If within 5% = Medium
        // Otherwise Low
        if (marks >= college.cutoff) {
            chance = 'High Chance';
        } else if (marks >= college.cutoff - 5) {
            chance = 'Medium Chance';
        }

        return {
            ...college,
            chance
        };
    }).sort((a, b) => {
        const order = { 'High Chance': 0, 'Medium Chance': 1, 'Low Chance': 2 };
        return order[a.chance] - order[b.chance];
    });
}
