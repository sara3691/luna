import { UserData, CareerRecommendation } from "../types";

const API_URL = '/.netlify/functions/gemini';

export async function getCareerRecommendations(userData: UserData): Promise<CareerRecommendation[]> {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(userData),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data.recommendations;
    } catch (error) {
        if (error instanceof Error && error.name === 'AbortError') {
            console.error('Request timed out');
        }
        console.error('Error fetching recommendations:', error);
        throw error;
    }
}
