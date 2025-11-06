
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from '../types';

const analysisSchema = {
    type: Type.OBJECT,
    properties: {
        matchScore: { 
            type: Type.INTEGER, 
            description: 'A score from 0 to 100 representing how well the resume matches the job description. Higher is better.' 
        },
        summary: { 
            type: Type.STRING, 
            description: 'A concise, professional summary of the candidate\'s fit for the role based on the resume and job description.' 
        },
        strengths: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of the top 3-5 key strengths from the resume that directly align with the job description\'s requirements.'
        },
        improvements: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of actionable suggestions to improve the resume for this specific job application. Focus on keywords, skills, and framing experience.'
        },
        missingKeywords: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: 'A list of important keywords found in the job description that are missing from the resume.'
        }
    },
    required: ['matchScore', 'summary', 'strengths', 'improvements', 'missingKeywords']
};

export const generateAnalysis = async (resumeText: string, jobDescription: string): Promise<AnalysisResult> => {
    if (!process.env.API_KEY) {
        throw new Error("API_KEY environment variable not set");
    }
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

    const prompt = `
        You are an expert career coach and resume analyzer with years of experience helping candidates land jobs at top companies.
        Your task is to analyze the provided resume against the given job description.
        Provide a detailed, constructive, and professional analysis in the required JSON format.

        **Resume Content:**
        ---
        ${resumeText}
        ---

        **Job Description:**
        ---
        ${jobDescription}
        ---

        **Analysis Instructions:**
        1.  **Match Score:** Calculate a score from 0 to 100 representing how well the resume matches the job description. Be critical and realistic.
        2.  **Summary:** Write a concise, professional summary (2-3 sentences) of the candidate's fit for the role.
        3.  **Strengths:** Identify and list the top 3-5 key strengths from the resume that directly align with the job description's most important requirements.
        4.  **Improvements:** Provide a list of actionable suggestions to improve the resume for this specific job application. Suggestions should be specific, e.g., "Quantify your achievement in the X project by adding metrics like 'increased efficiency by 15%'." or "Incorporate the keyword 'Agile Methodologies' into your skills section or project descriptions."
        5.  **Missing Keywords:** Identify a list of crucial keywords and technologies from the job description that are absent in the resume. This helps with applicant tracking systems (ATS).
    `;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            responseSchema: analysisSchema,
            temperature: 0.2,
        }
    });

    const jsonText = response.text.trim();
    try {
        return JSON.parse(jsonText) as AnalysisResult;
    } catch (e) {
        console.error("Failed to parse Gemini response as JSON:", jsonText);
        throw new Error("Received an invalid response from the AI. Please try again.");
    }
};