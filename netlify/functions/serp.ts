import { Handler } from '@netlify/functions';

const SERP_API_BASE = 'https://serpapi.com/search';


// ─────────────────────────────────────────────
// SERP API Search
// ─────────────────────────────────────────────

async function searchSerpAPI(query: string) {

    const apiKey = process.env.SERP_API_KEY;

    if (!apiKey || apiKey.includes('YOUR_')) {
        throw new Error(
            'SERP_API_KEY is not configured in Netlify environment variables.'
        );
    }

    const params = new URLSearchParams({
        q: query,
        api_key: apiKey,
        engine: 'google',
        num: '5',
        hl: 'en',
        gl: 'in',
        safe: 'active'
    });

    const response = await fetch(
        `${SERP_API_BASE}?${params.toString()}`
    );

    if (!response.ok) {

        const errorText = await response.text();

        throw new Error(
            `SERP API Error ${response.status}: ${errorText}`
        );
    }

    const data = await response.json();

    // SERP API can return an error object even when
    // the HTTP request succeeds.
    if (data?.error) {
        throw new Error(
            `SERP API Error: ${data.error}`
        );
    }

    return data;
}


// ─────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────

function cleanValue(value: unknown): string {

    if (
        typeof value !== 'string' ||
        !value.trim()
    ) {
        return '';
    }

    return value.trim();
}


function makeResultItem(result: any) {

    return {
        title: result?.title || '',
        link: result?.link || '#',
        snippet: result?.snippet || '',
        source: result?.displayed_link || ''
    };
}


// ─────────────────────────────────────────────
// Netlify Handler
// ─────────────────────────────────────────────

export const handler: Handler = async (event) => {

    // ─────────────────────────────────────────
    // CORS preflight
    // ─────────────────────────────────────────

    if (event.httpMethod === 'OPTIONS') {

        return {
            statusCode: 204,

            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers':
                    'Content-Type',
                'Access-Control-Allow-Methods':
                    'POST, OPTIONS'
            },

            body: ''
        };
    }


    // ─────────────────────────────────────────
    // Only POST allowed
    // ─────────────────────────────────────────

    if (event.httpMethod !== 'POST') {

        return {
            statusCode: 405,

            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Allow': 'POST, OPTIONS'
            },

            body: JSON.stringify({
                error: 'Method Not Allowed'
            })
        };
    }


    try {

        // ─────────────────────────────────────
        // Parse request body
        // ─────────────────────────────────────

        let requestBody: any;

        try {

            requestBody = JSON.parse(
                event.body || '{}'
            );

        } catch {

            return {
                statusCode: 400,

                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },

                body: JSON.stringify({
                    error: 'Invalid JSON request body'
                })
            };
        }


        // ─────────────────────────────────────
        // Read parameters
        // ─────────────────────────────────────

        const course =
            cleanValue(requestBody.course);

        const category =
            cleanValue(requestBody.category);

        const state =
            cleanValue(requestBody.state);

        const income =
            cleanValue(requestBody.income);

        const searchType =
            cleanValue(requestBody.searchType);


        // ─────────────────────────────────────
        // Validate course
        // ─────────────────────────────────────

        if (!course) {

            return {
                statusCode: 400,

                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },

                body: JSON.stringify({
                    error: 'Course name is required',
                    scholarships: [],
                    courseDetails: []
                })
            };
        }


        // ─────────────────────────────────────
        // Result structure
        // ─────────────────────────────────────

        const results: {
            scholarships: any[];
            courseDetails: any[];
        } = {
            scholarships: [],
            courseDetails: []
        };


        // ─────────────────────────────────────
        // Scholarship Search
        // ─────────────────────────────────────

        if (
            searchType === 'scholarships' ||
            !searchType
        ) {

            const scholarshipQueries = [

                // Government / official scholarship search
                `India government scholarship ${course} ${category} ${state} site:scholarships.gov.in`,

                // National Scholarship Portal
                `India scholarship ${course} ${category} students site:scholarships.gov.in`,

                // State scholarship
                `${state || 'India'} government scholarship ${course} ${category} ${income ? `income ${income}` : ''}`
            ];


            for (
                const query of scholarshipQueries.slice(0, 2)
            ) {

                try {

                    const data =
                        await searchSerpAPI(query);

                    const organicResults =
                        Array.isArray(
                            data?.organic_results
                        )
                            ? data.organic_results
                            : [];


                    const scholarshipItems =
                        organicResults
                            .slice(0, 4)
                            .map(makeResultItem);


                    results.scholarships.push(
                        ...scholarshipItems
                    );

                } catch (err) {

                    console.error(
                        'Scholarship search error:',
                        err
                    );
                }
            }


            // ─────────────────────────────────
            // Deduplicate scholarships
            // ─────────────────────────────────

            const seenTitles =
                new Set<string>();

            const seenLinks =
                new Set<string>();


            results.scholarships =
                results.scholarships
                    .filter((item) => {

                        const title =
                            item.title
                                .trim()
                                .toLowerCase();

                        const link =
                            item.link
                                .trim()
                                .toLowerCase();


                        if (
                            !title &&
                            !link
                        ) {
                            return false;
                        }


                        if (
                            seenTitles.has(title) ||
                            seenLinks.has(link)
                        ) {
                            return false;
                        }


                        if (title) {
                            seenTitles.add(title);
                        }

                        if (link) {
                            seenLinks.add(link);
                        }


                        return true;

                    })
                    .slice(0, 5);
        }


        // ─────────────────────────────────────
        // Course Details Search
        // ─────────────────────────────────────

        if (
            searchType === 'courseDetails' ||
            !searchType
        ) {

            const courseQuery =
                `${course} course details India colleges fees eligibility 2026`;


            try {

                const data =
                    await searchSerpAPI(
                        courseQuery
                    );


                const organicResults =
                    Array.isArray(
                        data?.organic_results
                    )
                        ? data.organic_results
                        : [];


                results.courseDetails =
                    organicResults
                        .slice(0, 4)
                        .map(makeResultItem);


            } catch (err) {

                console.error(
                    'Course details search error:',
                    err
                );
            }
        }


        // ─────────────────────────────────────
        // Success Response
        // ─────────────────────────────────────

        return {

            statusCode: 200,

            headers: {
                'Content-Type': 'application/json',

                'Access-Control-Allow-Origin': '*',

                'Access-Control-Allow-Headers':
                    'Content-Type',

                'Access-Control-Allow-Methods':
                    'POST, OPTIONS'
            },

            body: JSON.stringify(results)
        };


    } catch (error) {

        console.error(
            'SERP Search Error:',
            error
        );


        return {

            statusCode: 500,

            headers: {
                'Content-Type': 'application/json',

                'Access-Control-Allow-Origin': '*'
            },

            body: JSON.stringify({

                error: 'Search failed',

                details:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error',

                scholarships: [],

                courseDetails: []
            })
        };
    }
};
