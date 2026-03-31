import { Handler } from '@netlify/functions';

const SERP_API_BASE = 'https://serpapi.com/search';

async function searchSerpAPI(query: string) {
    const apiKey = process.env.SERP_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) {
        throw new Error('SERP API Key not configured');
    }

    const params = new URLSearchParams({
        q: query,
        api_key: apiKey,
        engine: 'google',
        num: '5',
        hl: 'en',
        gl: 'in',  // India region
        safe: 'active'
    });

    const response = await fetch(`${SERP_API_BASE}?${params.toString()}`);
    if (!response.ok) {
        throw new Error(`SERP API Error: ${response.status} ${response.statusText}`);
    }
    return response.json();
}

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { course, category, state, income, searchType } = JSON.parse(event.body || '{}');

        if (!course) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: 'Course name is required' })
            };
        }

        let results: { scholarships: any[]; courseDetails: any[] } = {
            scholarships: [],
            courseDetails: []
        };

        if (searchType === 'scholarships' || !searchType) {
            // Build targeted scholarship search query
            const scholarshipQueries = [
                `India government scholarship ${course} ${category || ''} ${state || ''} site:scholarships.gov.in OR site:buddy4study.com OR site:nationalscholarship.gov.in`,
                `India central government scholarship ${course} ${category || ''} students 2024 2025`,
                `${state || 'India'} state government scholarship ${course} ${income ? 'income ' + income : ''}`
            ];

            for (const query of scholarshipQueries.slice(0, 2)) {
                try {
                    const data = await searchSerpAPI(query);
                    const organicResults = data.organic_results || [];
                    const scholarshipItems = organicResults.slice(0, 4).map((r: any) => ({
                        title: r.title || '',
                        link: r.link || '#',
                        snippet: r.snippet || '',
                        source: r.displayed_link || ''
                    }));
                    results.scholarships.push(...scholarshipItems);
                } catch (err) {
                    console.error('Scholarship search error:', err);
                }
            }

            // Deduplicate
            const seen = new Set();
            results.scholarships = results.scholarships.filter(s => {
                const key = s.title;
                if (seen.has(key)) return false;
                seen.add(key);
                return true;
            }).slice(0, 5);
        }

        if (searchType === 'courseDetails' || !searchType) {
            // Course details search
            const courseQuery = `${course} course details India colleges fees eligibility 2024 2025`;
            try {
                const data = await searchSerpAPI(courseQuery);
                const organicResults = data.organic_results || [];
                results.courseDetails = organicResults.slice(0, 4).map((r: any) => ({
                    title: r.title || '',
                    link: r.link || '#',
                    snippet: r.snippet || '',
                    source: r.displayed_link || ''
                }));
            } catch (err) {
                console.error('Course details search error:', err);
            }
        }

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(results)
        };

    } catch (error) {
        console.error('SERP Search Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Search failed',
                details: error instanceof Error ? error.message : 'Unknown error',
                scholarships: [],
                courseDetails: []
            })
        };
    }
};
