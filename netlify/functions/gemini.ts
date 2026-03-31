import { Handler } from '@netlify/functions';
import { GoogleGenerativeAI } from '@google/generative-ai';

// List of Gemini configurations to try in order
const GOOGLE_CONFIGS = [
    { key: process.env.GEMINI_API_KEY, model: "gemini-1.5-flash" },
    { key: process.env.GEMINI_API_KEY_2, model: "gemini-1.5-flash" },
    { key: process.env.GEMINI_API_KEY_3, model: "gemini-1.5-flash" },
    { key: process.env.GEMINI_API_KEY, model: "gemini-1.5-pro" }
].filter(config => config.key && !config.key.includes('YOUR_'));

async function tryGenerateWithGemini(config: { key: string, model: string }, prompt: string) {
    const genAI = new GoogleGenerativeAI(config.key);
    const model = genAI.getGenerativeModel({
        model: config.model,
        generationConfig: {
            responseMimeType: "application/json",
        }
    });

    const result = await Promise.race([
        model.generateContent(prompt),
        new Promise((_, reject) => setTimeout(() => reject(new Error('AI Timeout')), 10000))
    ]) as any;

    const responseText = result.response.text();
    return JSON.parse(responseText);
}

async function tryGenerateWithGroq(prompt: string) {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey || apiKey.includes('YOUR_')) throw new Error('Groq API Key not configured');

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: "llama-3.3-70b-versatile",
            messages: [{ role: "user", content: prompt }],
            response_format: { type: "json_object" }
        })
    });

    if (!response.ok) throw new Error(`Groq API Error: ${response.statusText}`);
    const data = await response.json();
    return JSON.parse(data.choices[0].message.content);
}

export const handler: Handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const userData = JSON.parse(event.body || '{}');

        const prompt = `
      Act as an expert Indian Career Counselor. Analyze this student profile:
      Board: ${userData.educationBoard}, Stream: ${userData.stream}, Subjects: ${userData.subjects}, Marks: ${userData.marks}%, Gender: ${userData.gender}, Category: ${userData.category}, Annual Income: ${userData.annualIncome}, Skills: ${userData.skills.join(', ')}, Interests: ${userData.interests.primary}, ${userData.interests.other || ''}, Location Preference: ${userData.location.state} (Districts: ${userData.location.districts.join(', ') || 'Any'}), Anywhere in India: ${userData.location.anywhereInIndia ? 'Yes' : 'No'}

      Based on this, suggest 3-5 realistic and high-potential career paths in India. Return the response in this EXACT JSON format:
      {
        "recommendations": [
          {
            "id": "string", "title": "Course/Career Title", "description": "Short overview", "eligibility": "Academic requirements", "duration": "Duration in years", "averageSalary": "Expected salary range in INR LPA", "topColleges": ["List of 3-4 top Indian colleges"], "careerPath": ["Step 1", "Step 2", "Step 3"], "tags": ["relevant", "keywords"]
          }
        ]
      }
    `;

        let lastError = null;

        // 1. Try Gemini configs
        for (const config of GOOGLE_CONFIGS) {
            try {
                console.log(`Attempting Gemini analysis with model: ${config.model}...`);
                const parsedResponse = await tryGenerateWithGemini(config as { key: string, model: string }, prompt);
                return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsedResponse) };
            } catch (error) {
                console.error(`Gemini failed (${config.model}):`, error);
                lastError = error;
            }
        }

        // 2. Try Groq fallback
        try {
            console.log(`Attempting Groq analysis...`);
            const parsedResponse = await tryGenerateWithGroq(prompt);
            return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(parsedResponse) };
        } catch (error) {
            console.error(`Groq failed:`, error);
            lastError = error;
        }

        throw lastError || new Error('All analysis models failed');

    } catch (error) {
        console.error('Final Analysis Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: 'Failed to generate recommendations',
                details: error instanceof Error ? error.message : 'Unknown error'
            }),
        };
    }
};
