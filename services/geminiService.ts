import { GoogleGenAI, GenerateContentRequest, GenerateContentResponse, Part } from "@google/genai";
import { fileToDataUrl, pdfToText } from '../utils/fileUtils';
import { 
    emailAnalyzerAndDrafterSystemPrompt, 
    jargonExplanationSystemPrompt,
    incidentReportSystemPrompt
} from '../prompts';
import { CaseAnalysisReport, EmailBuddyResponse, IncidentReport, IncidentData } from '../types/ai';

// Initialize the GoogleGenAI client
// Fix: Initialize the GoogleGenAI client as per the guidelines.
// FIX: Export the `ai` instance to make it available for other modules.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// --- Helper Functions ---

/**
 * A generic function to call the Gemini API and parse the JSON response.
 * @param request The request object for the generateContent call.
 * @returns The parsed JSON response.
 */
const generateAndParseJson = async <T>(request: GenerateContentRequest): Promise<T> => {
    try {
        // Fix: Use ai.models.generateContent to call the API.
        const response: GenerateContentResponse = await ai.models.generateContent(request);
        // Fix: Access the response text directly via the .text property.
        const text = response.text;
        
        // Clean the text before parsing
        const cleanedText = text.trim().replace(/^```json\s*|```\s*$/g, '');
        
        return JSON.parse(cleanedText) as T;

    } catch (error: any) {
        console.error("Gemini API call failed:", error);
        // Re-throw a more specific error
        if (error.message.includes('JSON')) {
             throw new Error("AI returned an invalid response format. Please try again.");
        }
        throw new Error(`AI service error: ${error.message}`);
    }
};


// --- Case Analysis Tool ---

/**
 * Prepares content parts from files and text for the Gemini API.
 * Converts images to base64 and extracts text from PDFs.
 */
export const prepareContentParts = async (files: File[], text: string): Promise<Part[]> => {
    const parts: Part[] = [];

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const dataUrl = await fileToDataUrl(file);
            const base64Data = dataUrl.split(',')[1];
            parts.push({
                inlineData: { mimeType: file.type, data: base64Data },
            });
            parts.push({ text: `--- START OF DOCUMENT: ${file.name} ---` });
        } else if (file.type === 'application/pdf') {
            const pdfText = await pdfToText(file);
            parts.push({ text: `--- START OF DOCUMENT: ${file.name} ---\n${pdfText}\n--- END OF DOCUMENT: ${file.name} ---` });
        }
    }

    if (text.trim()) {
        parts.push({ text: `--- START OF PASTED TEXT ---\n${text}\n--- END OF PASTED TEXT ---` });
    }

    return parts;
};

/**
 * Calls the Gemini API to analyze case documents.
 */
export const analyzeCaseDocuments = async (contentParts: Part[], systemInstruction: string): Promise<CaseAnalysisReport> => {
    const request: GenerateContentRequest = {
        model: 'gemini-2.5-flash',
        contents: { parts: contentParts },
        config: {
            systemInstruction,
            responseMimeType: 'application/json',
        }
    };
    return generateAndParseJson<CaseAnalysisReport>(request);
};


// --- Email Law Buddy ---

/**
 * Calls the Gemini API to analyze an email and draft responses.
 */
export const analyzeAndDraftEmailResponses = (receivedEmail: string): Promise<EmailBuddyResponse> => {
    const request: GenerateContentRequest = {
        model: 'gemini-2.5-flash',
        contents: receivedEmail,
        config: {
            systemInstruction: emailAnalyzerAndDrafterSystemPrompt,
            responseMimeType: 'application/json',
        }
    };
    return generateAndParseJson<EmailBuddyResponse>(request);
};

/**
 * Calls the Gemini API to explain a legal term.
 */
export const explainJargon = (term: string, context: string): Promise<{ explanation: string; suggested_question: string; }> => {
    const prompt = `Term: "${term}"\nContext: "${context}"`;
    const request: GenerateContentRequest = {
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: jargonExplanationSystemPrompt,
            responseMimeType: 'application/json',
        }
    };
    return generateAndParseJson<{ explanation: string; suggested_question: string; }>(request);
};


// --- Incident Reporter ---

/**
 * Calls the Gemini API to generate an incident report.
 */
export const generateIncidentReport = (data: IncidentData): Promise<IncidentReport> => {
    // Combine all user input into a single prompt for the AI
    const prompt = `
        **Jurisdiction:** ${data.jurisdiction}
        **Incident Date:** ${data.incidentDate}
        **Location:** ${data.location}
        **Category:** ${data.category}
        **People Involved:** ${data.peopleInvolved.join(', ')}

        **User's Narrative:**
        ${data.narrative}
    `;

    const request: GenerateContentRequest = {
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: incidentReportSystemPrompt,
            responseMimeType: 'application/json',
        },
    };

    return generateAndParseJson<IncidentReport>(request);
};