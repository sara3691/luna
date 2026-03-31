import { Handler } from '@netlify/functions';

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

async function callGroq(prompt: string) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) {
        throw new Error('Groq API Key not configured. Please set GROQ_API_KEY in your environment.');
    }

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
        })
    });

    if (!response.ok) {
        const errBody = await response.text();
        throw new Error(`Groq API Error ${response.status}: ${errBody}`);
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response from Groq');
    return JSON.parse(content);
}

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const userData = JSON.parse(event.body || '{}');
        const courseHint = userData.selectedCourse
            ? `The student wants to specifically explore: "${userData.selectedCourse}". Prioritize this course if relevant.`
            : '';

        const prompt = `
Act as an expert Indian Career Counselor. Analyze this student profile and provide career recommendations:

Student Profile:
- Board: ${userData.educationBoard}
- Stream: ${userData.stream}
- Subjects: ${userData.subjects}
- Marks: ${userData.marks}%
- Gender: ${userData.gender}
- Category: ${userData.category} (SC/ST/OBC/General)
- Annual Family Income: ${userData.annualIncome}
- Skills: ${userData.skills?.join(', ') || 'Not specified'}
- Interests: ${userData.interests?.primary || ''} ${userData.interests?.other ? ', ' + userData.interests.other : ''}
- Location: ${userData.location?.state || 'India'} (Districts: ${userData.location?.districts?.join(', ') || 'Any'})
- Open to study anywhere in India: ${userData.location?.anywhereInIndia ? 'Yes' : 'No'}
- Study Abroad Interest: ${userData.location?.studyAbroad ? 'Yes' : 'No'}
${courseHint}

Based on this profile, suggest 4-5 realistic and high-potential career paths in India. 
For each career, also mention what Indian government scholarships are available for the student's category and income level.

Return ONLY valid JSON in this EXACT format:
{
  "recommendations": [
    {
      "id": "unique-string-id",
      "title": "Course/Career Title",
      "description": "2-3 sentence overview of the course and career",
      "eligibility": "Academic requirements and entrance exams",
      "duration": "X Years / X Months",
      "averageSalary": "₹X - ₹Y LPA",
      "topColleges": ["College 1", "College 2", "College 3", "College 4"],
      "careerPath": ["Step 1: Entry level role", "Step 2: Mid-level", "Step 3: Senior level", "Step 4: Leadership"],
      "tags": ["relevant", "keywords", "stream"],
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

        const parsedResponse = await callGroq(prompt);

        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(parsedResponse)
        };

    } catch (error) {
        console.error('Groq Analysis Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to generate recommendations',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
        };
    }
};
