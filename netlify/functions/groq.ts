import { Handler } from '@netlify/functions';

const GROQ_API_URL =
    'https://api.groq.com/openai/v1/chat/completions';

// Current Groq model
const GROQ_MODEL = 'openai/gpt-oss-120b';


async function callGroq(prompt: string) {

    const apiKey = process.env.GROQ_API_KEY;

    if (!apiKey || apiKey.includes('YOUR_')) {
        throw new Error(
            'Groq API Key not configured. Please set GROQ_API_KEY in your Netlify environment variables.'
        );
    }

    const response = await fetch(
        GROQ_API_URL,
        {
            method: 'POST',

            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json'
            },

            body: JSON.stringify({

                // ✅ FIXED MODEL
                model: GROQ_MODEL,

                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],

                response_format: {
                    type: 'json_object'
                },

                temperature: 0.7,
                max_tokens: 4096
            })
        }
    );


    // ─────────────────────────────────────────
    // Handle Groq API errors
    // ─────────────────────────────────────────

    if (!response.ok) {

        const errBody = await response.text();

        console.error(
            `Groq API Error ${response.status}:`,
            errBody
        );

        throw new Error(
            `Groq API Error ${response.status}: ${errBody}`
        );
    }


    // ─────────────────────────────────────────
    // Parse response
    // ─────────────────────────────────────────

    const data = await response.json();

    const content =
        data?.choices?.[0]?.message?.content;


    if (!content) {
        throw new Error(
            'Empty response from Groq API'
        );
    }


    try {

        return JSON.parse(content);

    } catch (error) {

        console.error(
            'Invalid JSON returned by Groq:',
            content
        );

        throw new Error(
            'Groq returned invalid JSON response'
        );
    }
}


// ─────────────────────────────────────────────
// Netlify Handler
// ─────────────────────────────────────────────

export const handler: Handler = async (event) => {

    // Only POST allowed
    if (event.httpMethod !== 'POST') {

        return {
            statusCode: 405,

            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Allow': 'POST'
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

        const userData = JSON.parse(
            event.body || '{}'
        );


        // ─────────────────────────────────────
        // Course hint
        // ─────────────────────────────────────

        const courseHint =
            userData.selectedCourse
                ? `
The student wants to specifically explore:
"${userData.selectedCourse}".

Prioritize this course if it is relevant to
the student's profile.
`
                : '';


        // ─────────────────────────────────────
        // AI Prompt
        // ─────────────────────────────────────

        const prompt = `
Act as an expert Indian Career Counselor.

Analyze the following student profile and provide
realistic career recommendations.

STUDENT PROFILE:

- Board:
${userData.educationBoard || 'Not specified'}

- Stream:
${userData.stream || 'Not specified'}

- Subjects:
${userData.subjects || 'Not specified'}

- Marks:
${userData.marks ?? 'Not specified'}%

- Gender:
${userData.gender || 'Not specified'}

- Category:
${userData.category || 'Not specified'}
(SC/ST/OBC/General)

- Annual Family Income:
${userData.annualIncome || 'Not specified'}

- Skills:
${userData.skills?.join(', ') || 'Not specified'}

- Interests:
${userData.interests?.primary || 'Not specified'}
${userData.interests?.other
    ? `, ${userData.interests.other}`
    : ''}

- Location:
${userData.location?.state || 'India'}

- Districts:
${userData.location?.districts?.join(', ') || 'Any'}

- Open to study anywhere in India:
${userData.location?.anywhereInIndia ? 'Yes' : 'No'}

- Study Abroad Interest:
${userData.location?.studyAbroad ? 'Yes' : 'No'}

${courseHint}


TASK:

Suggest 4-5 realistic and suitable career paths
for this student in India.

For each career path:

1. Explain the course/career.
2. Give eligibility requirements.
3. Mention entrance exams where applicable.
4. Give approximate duration.
5. Give approximate salary range.
6. Suggest real colleges.
7. Give a career progression path.
8. Mention relevant Indian government scholarships
   based on category and income.


IMPORTANT:

- Do not invent colleges.
- Do not invent scholarship names.
- Use realistic Indian education information.
- Keep the recommendations relevant to the student's
  stream, marks, skills and interests.
- Return ONLY valid JSON.
- Do not add Markdown.
- Do not add explanations outside JSON.


RETURN EXACTLY THIS JSON STRUCTURE:

{
  "recommendations": [
    {
      "id": "unique-string-id",

      "title": "Course/Career Title",

      "description": "2-3 sentence overview of the course and career",

      "eligibility": "Academic requirements and entrance exams",

      "duration": "X Years / X Months",

      "averageSalary": "₹X - ₹Y LPA",

      "topColleges": [
        "College 1",
        "College 2",
        "College 3",
        "College 4"
      ],

      "careerPath": [
        "Step 1: Entry level role",
        "Step 2: Mid-level",
        "Step 3: Senior level",
        "Step 4: Leadership"
      ],

      "tags": [
        "relevant",
        "keywords",
        "stream"
      ],

      "governmentScholarships": [
        {
          "name": "Scholarship Name",

          "provider": "Ministry / State Govt",

          "eligibility": "Who can apply",

          "amount": "₹X per year"
        }
      ]
    }
  ]
}
`;


        // ─────────────────────────────────────
        // Call Groq
        // ─────────────────────────────────────

        const parsedResponse =
            await callGroq(prompt);


        // ─────────────────────────────────────
        // Validate response
        // ─────────────────────────────────────

        if (
            !parsedResponse ||
            !Array.isArray(
                parsedResponse.recommendations
            )
        ) {

            throw new Error(
                'Invalid response format from Groq'
            );
        }


        // ─────────────────────────────────────
        // Success
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

            body: JSON.stringify(
                parsedResponse
            )
        };

    } catch (error) {

        console.error(
            'Groq Analysis Error:',
            error
        );


        return {

            statusCode: 500,

            headers: {
                'Content-Type': 'application/json',

                'Access-Control-Allow-Origin': '*'
            },

            body: JSON.stringify({

                error:
                    'Failed to generate recommendations',

                details:
                    error instanceof Error
                        ? error.message
                        : 'Unknown error'
            })
        };
    }
};
