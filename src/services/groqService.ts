import { UserData, CareerRecommendation, ScholarshipResult, CourseDetail, CollegeRecommendationResult } from "../types";

// ─── Groq Direct API (called from browser, no Netlify function needed) ────────
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

// Read from Vite env (must prefix with VITE_)
const GROQ_API_KEYS = [
    import.meta.env.VITE_GROQ_API_KEY as string,
    import.meta.env.VITE_GROQ_API_KEY_2 as string,
    import.meta.env.VITE_GROQ_API_KEY_3 as string
].filter(key => key && !key.includes('YOUR_'));

const SERP_API_KEY = import.meta.env.VITE_SERP_API_KEY as string;

// ── Career Recommendations via Groq ──────────────────────────────────────────
export async function getCareerRecommendations(userData: UserData): Promise<CareerRecommendation[]> {
    if (GROQ_API_KEYS.length === 0) {
        throw new Error('No valid VITE_GROQ_API_KEY set in .env');
    }

    const courseHint = userData.selectedCourse
        ? `The student specifically wants to explore: "${userData.selectedCourse}". Prioritize this course if suitable.`
        : '';

    const prompt = `
Act as an expert Indian Career Counselor. Analyze this student profile:

- Board: ${userData.educationBoard}
- Stream: ${userData.stream}
- Subjects: ${userData.subjects}
- Marks: ${userData.marks}%
- Gender: ${userData.gender}
- Category: ${userData.category}
- Annual Family Income: ${userData.annualIncome}
- Skills: ${userData.skills?.join(', ') || 'Not specified'}
- Interests: ${userData.interests?.primary || ''} ${userData.interests?.other ? ', ' + userData.interests.other : ''}
- State: ${userData.location?.state || 'India'}
- Anywhere in India: ${userData.location?.anywhereInIndia ? 'Yes' : 'No'}
${courseHint}

Suggest 4-5 realistic career paths. For each, mention government scholarships available based on category and income.

Return ONLY valid JSON:
{
  "recommendations": [
    {
      "id": "unique-id",
      "title": "Course/Career Title",
      "description": "2-3 sentence overview",
      "eligibility": "Academic requirements + entrance exams",
      "duration": "X Years",
      "averageSalary": "₹X - ₹Y LPA",
      "topColleges": ["College 1", "College 2", "College 3"],
      "careerPath": ["Step 1", "Step 2", "Step 3", "Step 4"],
      "tags": ["tag1", "tag2"],
      "governmentScholarships": [
        { "name": "Scholarship", "provider": "Ministry/Dept", "eligibility": "Who can apply", "amount": "₹X/year" }
      ]
    }
  ]
}`;

    let lastError: Error | null = null;

    // Try each API key until one works
    for (const apiKey of GROQ_API_KEYS) {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 30000);

        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [{ role: 'user', content: prompt }],
                    response_format: { type: 'json_object' },
                    temperature: 0.7,
                    max_tokens: 4096
                }),
                signal: controller.signal
            });

            clearTimeout(timeout);

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                const errMsg = err?.error?.message || `Groq API Error: ${response.status}`;
                console.warn(`API Key failed: ${errMsg}. Trying next key if available...`);
                lastError = new Error(errMsg);
                continue; // Try next key
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (!content) throw new Error('Empty response from Groq');

            const parsed = JSON.parse(content);
            if (!parsed.recommendations || !Array.isArray(parsed.recommendations)) {
                throw new Error('Invalid JSON format from Groq');
            }
            return parsed.recommendations;

        } catch (error: any) {
            clearTimeout(timeout);
            if (error.name === 'AbortError') {
                lastError = new Error('Request timed out. Trying next key if available...');
            } else {
                lastError = error;
            }
            console.warn(`API call failed: ${lastError?.message}. Trying next key if available...`);
            continue; // Try next key
        }
    }

    throw lastError || new Error('All API keys failed. Please check your credentials or try again later.');
}

// ── SERP: Scholarship & Course Details Search ─────────────────────────────────
export interface SerpSearchResult {
    scholarships: ScholarshipResult[];
    courseDetails: CourseDetail[];
}

export async function searchScholarshipsAndCourses(
    course: string,
    category: string,
    state: string,
    income: string
): Promise<SerpSearchResult> {
    if (!SERP_API_KEY || SERP_API_KEY.includes('YOUR_')) {
        return { scholarships: [], courseDetails: [] };
    }

    const buildUrl = (query: string) => {
        const params = new URLSearchParams({
            q: query,
            api_key: SERP_API_KEY,
            engine: 'google',
            num: '5',
            hl: 'en',
            gl: 'in'
        });
        return `https://serpapi.com/search?${params.toString()}`;
    };

    const scholarships: ScholarshipResult[] = [];
    const courseDetails: CourseDetail[] = [];

    try {
        // Scholarship search
        const scholarshipQuery = `India government scholarship "${course}" ${category} ${state} site:nationalscholarship.gov.in OR site:buddy4study.com OR site:scholarships.gov.in`;
        const sRes = await fetch(buildUrl(scholarshipQuery));
        if (sRes.ok) {
            const sData = await sRes.json();
            (sData.organic_results || []).slice(0, 5).forEach((r: any) => {
                scholarships.push({
                    title: r.title || '',
                    link: r.link || '#',
                    snippet: r.snippet || '',
                    source: r.displayed_link || ''
                });
            });
        }
    } catch (e) {
        console.warn('Scholarship search failed:', e);
    }

    try {
        // Course details search
        const courseQuery = `${course} course India fees colleges eligibility 2025`;
        const cRes = await fetch(buildUrl(courseQuery));
        if (cRes.ok) {
            const cData = await cRes.json();
            (cData.organic_results || []).slice(0, 4).forEach((r: any) => {
                courseDetails.push({
                    title: r.title || '',
                    link: r.link || '#',
                    snippet: r.snippet || '',
                    source: r.displayed_link || ''
                });
            });
        }
    } catch (e) {
        console.warn('Course details search failed:', e);
    }

    return { scholarships, courseDetails };
}

// ── College Recommendations via Groq ─────────────────────────────────────────
// ── College Recommendations via Groq ─────────────────────────────────────────
export async function getGroqCollegeRecommendations(
    course: string,
    state: string,
    anywhereInIndia: boolean,
    marks: number,
    stream: string,
    subjects: string,
    studyAbroad: boolean = false
): Promise<CollegeRecommendationResult[]> {
    const apiKey = import.meta.env.VITE_GROQ_API_KEY_3 as string;

    if (!apiKey || apiKey.includes('YOUR_')) {
        throw new Error('VITE_GROQ_API_KEY_3 is not set in .env');
    }

    let locationStr = "";
    if (studyAbroad) {
        // Here 'state' will be the country name (e.g., UK, USA, etc.)
        locationStr = `in ${state}`;
    } else if (anywhereInIndia) {
        locationStr = "anywhere in India";
    } else {
        locationStr = `in ${state}, India`;
    }

    const eligibility = `${stream} stream (${subjects}) with ${marks}% marks`;

    const prompt = `
Act as an expert Global Academic Consultant. Provide at least 3 real and valid institutions offering "${course}" for a student looking for options ${locationStr}.
Student Profile: ${eligibility}

Ensure the course is actually available in these colleges/universities.

Return ONLY valid JSON:
{
  "colleges": [
    {
      "id": "unique-string-id",
      "name": "Full College Name",
      "location": "City",
      "state": "${studyAbroad ? state : 'State in India'}",
      "isAbroad": ${studyAbroad},
      "fees": "Estimated annual fees (e.g. ₹X Lakhs or $X)",
      "cutoff": ${marks >= 80 ? 80 : 70},
      "entranceExam": "Name of exam if any (e.g. JEE Main, NEET, SAT, IELTS etc.)",
      "tags": ["Tag 1", "Tag 2"],
      "courses": ["${course}"],
      "chance": "High Chance" 
    }
  ]
}

Rules:
1. "chance" must be one of: "High Chance", "Medium Chance", "Low Chance" based on the student's marks (${marks}%) vs typical cutoff.
2. Provide at least 3 institutions. This is CRITICAL. If you cannot find 3 in the specific location, provide the closest top-tier alternatives globally or nationally.
3. Return only real, existing institutions. NO placeholders.
4. If study abroad is true, return fees in local currency or USD/INR as appropriate.`;

    const fetchColleges = async (currentPrompt: string) => {
        try {
            const response = await fetch(GROQ_API_URL, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${apiKey}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: 'llama-3.3-70b-versatile',
                    messages: [
                        { role: 'system', content: 'You are a professional education consultant. Always return valid JSON only.' },
                        { role: 'user', content: currentPrompt }
                    ],
                    response_format: { type: 'json_object' },
                    temperature: 0.6,
                    max_tokens: 3000
                })
            });

            if (!response.ok) {
                const err = await response.json().catch(() => ({}));
                throw new Error(err?.error?.message || `Groq API Error: ${response.status}`);
            }

            const data = await response.json();
            const content = data.choices?.[0]?.message?.content;
            if (!content) throw new Error('Empty response from Groq');

            const parsed = JSON.parse(content);
            if (!parsed.colleges || !Array.isArray(parsed.colleges)) {
                throw new Error('Invalid JSON format from Groq');
            }
            return parsed.colleges as CollegeRecommendationResult[];
        } catch (error: any) {
            console.error('Groq fetch error:', error);
            throw error;
        }
    };

    let result = await fetchColleges(prompt);

    // If less than 3, try again with a more insistent prompt
    if (result.length < 3) {
        const retryPrompt = `${prompt}\n\nIMPORTANT: Your previous response only returned ${result.length} result(s). I REQUIRE AT LEAST 3. Please research more thoroughly and return a minimum of 3 valid institutions for ${course} ${locationStr}.`;
        const retryResult = await fetchColleges(retryPrompt);
        // Combine if needed or just replace
        if (retryResult.length >= result.length) {
            result = retryResult;
        }
    }

    return result.slice(0, 5); // Return top 5 maximum
}
