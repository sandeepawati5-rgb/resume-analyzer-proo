
export interface AnalysisResult {
    matchScore: number;
    summary: string;
    strengths: string[];
    improvements: string[];
    missingKeywords: string[];
}