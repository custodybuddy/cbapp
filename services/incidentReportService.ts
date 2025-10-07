import { Type } from "@google/genai";
import { ai } from './geminiClient';
import { IncidentReportSchema, IncidentReport, IncidentData } from '../types/ai';

const systemPrompt = `You are an AI legal documentation specialist for CustodyBuddy.com. Your task is to analyze a co-parenting incident narrative and generate a comprehensive, objective report in a structured JSON format.

**TASK:**
Analyze the provided incident details and narrative to populate the JSON schema. Your analysis must be objective, factual, and written in a professional tone suitable for legal review. Do not include any information that is not supported by the user's narrative. For the 'legalInsights', your analysis MUST be specific to the provided 'jurisdiction'.

**JSON STRUCTURE & CONTENT GUIDELINES:**
- **title**: A brief, descriptive, and neutral title for the incident.
- **category**: Choose the most fitting category from the provided enum list.
- **severity**: Assign a "Low", "Medium", or "High" severity rating.
- **severityJustification**: Provide a concise, 1-2 sentence explanation for your severity rating based on the narrative.
- **professionalSummary**: Write a 2-3 paragraph summary. This is CRITICAL. It must be objective, remove emotional language, and preserve all key factual details like dates, times, locations, individuals present, and specific actions or quotes from the narrative.
- **observedImpact**: Write a 1-2 paragraph analysis of the potential or observed impact on the children involved, based ONLY on the narrative.
- **legalInsights**: Write a 2-3 paragraph analysis. Reference relevant family law principles or statutes for the specific 'jurisdiction' provided by the user. Do NOT give legal advice. Frame this as informational insights (e.g., "In [Jurisdiction], actions such as... may be relevant to sections of the Family Law Act concerning...").
- **sources**: Provide a list of 3-5 general, credible legal or informational websites relevant to family law in the specified jurisdiction (e.g., a link to the provincial Ministry of the Attorney General, a legal aid website, or a public legal education site).
- **aiNotes**: Provide brief, actionable recommendations for the user on what to document further or what evidence might be useful to collect.
`;

const createGeminiResponseSchema = () => ({
    type: Type.OBJECT,
    properties: {
        title: { type: Type.STRING, description: "Brief descriptive title of the incident" },
        category: { type: Type.STRING, description: "One of: Child Safety/Welfare Concern, Communication Issues, Schedule Violations, Breach of Court Order, Parental Alienation, Inappropriate Behavior, Financial Disputes, or Other" },
        severity: { type: Type.STRING, description: "Low, Medium, or High" },
        severityJustification: { type: Type.STRING, description: "1-2 sentence explanation of why this severity level was assigned" },
        professionalSummary: { type: Type.STRING, description: "Comprehensive 2-3 paragraph professional summary removing emotional language while preserving all factual details, dates, times, and specific actions" },
        observedImpact: { type: Type.STRING, description: "1-2 paragraph analysis of the potential or observed impact on the children involved" },
        legalInsights: { type: Type.STRING, description: "2-3 paragraph analysis of relevant family law principles, jurisdictional considerations, and legal implications specific to the provided jurisdiction" },
        sources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of 3-5 potential legal or informational sources like 'justice.gc.ca'" },
        aiNotes: { type: Type.STRING, description: "Brief notes on documentation completeness and recommendations for evidence collection" },
    },
    required: ["title", "category", "severity", "severityJustification", "professionalSummary", "observedImpact", "legalInsights", "sources", "aiNotes"]
});

/**
 * Generates a structured incident report from a user's narrative using Gemini's JSON mode.
 * @param incidentData - The raw data of the incident provided by the user.
 * @returns A promise that resolves to the parsed JSON object of the incident report.
 */
export const generateIncidentReport = async (incidentData: IncidentData): Promise<IncidentReport> => {
    const userContent = `Please analyze the following incident and generate the report.
INCIDENT DETAILS:
- Date & Time: ${incidentData.dateTime}
- Jurisdiction: ${incidentData.jurisdiction}
- Location: ${incidentData.location || 'Not specified'}
- Parties Involved: ${incidentData.involvedParties || 'Not specified'}
- User's Narrative: ${incidentData.narrative}
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userContent,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: createGeminiResponseSchema(),
        },
    });

    const responseText = response.text;
    const parsedData = JSON.parse(responseText);

    const validationResult = IncidentReportSchema.safeParse(parsedData);
    if (!validationResult.success) {
        console.error("AI response did not match expected schema:", validationResult.error.issues);
        throw new Error("The AI returned a response with an unexpected format. Please try again.");
    }

    return validationResult.data;
};