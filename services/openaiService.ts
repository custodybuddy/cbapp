import OpenAI from 'openai';
import { ChatCompletionMessageParam } from 'openai/resources/chat';
import { fileToDataUrl, pdfToText } from '../utils/fileUtils';
import {
    emailAnalyzerAndDrafterSystemPrompt,
    jargonExplanationSystemPrompt,
    incidentReportSystemPrompt
} from '../prompts';
import { CaseAnalysisReport, EmailBuddyResponse, IncidentReport, IncidentData } from '../types/ai';

// 1. Client Initialization
const openai = new OpenAI({
    baseURL: window.location.origin + '/backend/api-relay.php',
    apiKey: 'not-needed-due-to-relay', // A non-empty string is required by the constructor.
    dangerouslyAllowBrowser: true,
});

// 2. Core Function
/**
 * A generic function to call the OpenAI API and parse the JSON response.
 * @param model The OpenAI model to use.
 * @param systemPrompt The system-level instruction for the AI.
 * @param userPrompt The user's prompt, can be text or rich content parts.
 * @returns The parsed JSON response.
 */
const generateAndParseJson = async <T>(
    model: 'gpt-4o-mini' | 'gpt-3.5-turbo',
    systemPrompt: string,
    userPrompt: string | OpenAI.Chat.Completions.ChatCompletionContentPart[]
): Promise<T> => {
    try {
        const messages: ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ];

        const response = await openai.chat.completions.create({
            model: model,
            messages: messages,
            stream: false,
            response_format: { type: "json_object" }
        });

        const content = response.choices[0]?.message?.content;
        if (!content) {
            throw new Error("AI returned an empty response.");
        }
        
        // The API in json_object mode should return a valid JSON string.
        return JSON.parse(content) as T;

    } catch (error: any) {
        console.error("OpenAI API call failed:", error);
        if (error.message.includes('JSON')) {
             throw new Error("AI returned an invalid response format. Please try again.");
        }
        throw new Error(`AI service error: ${error.message}`);
    }
};

// 3. Feature Implementations

// --- Case Analysis Tool ---

/**
 * Prepares content parts from files and text for the OpenAI API.
 * Converts images to base64 and extracts text from PDFs.
 */
export const prepareContentParts = async (files: File[], text: string): Promise<OpenAI.Chat.Completions.ChatCompletionContentPart[]> => {
    const parts: OpenAI.Chat.Completions.ChatCompletionContentPart[] = [];

    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const dataUrl = await fileToDataUrl(file);
            parts.push({ type: "text", text: `--- START OF DOCUMENT: ${file.name} ---` });
            parts.push({
                type: "image_url",
                image_url: { url: dataUrl, detail: "auto" }
            });
        } else if (file.type === 'application/pdf') {
            const pdfText = await pdfToText(file);
            parts.push({ type: "text", text: `--- START OF DOCUMENT: ${file.name} ---\n${pdfText}\n--- END OF DOCUMENT: ${file.name} ---` });
        }
    }

    if (text.trim()) {
        parts.push({ type: "text", text: `--- START OF PASTED TEXT ---\n${text}\n--- END OF PASTED TEXT ---` });
    }

    return parts;
};

/**
 * Calls the OpenAI API to analyze case documents using gpt-4o-mini.
 */
export const analyzeCaseDocuments = async (contentParts: OpenAI.Chat.Completions.ChatCompletionContentPart[], systemInstruction: string): Promise<CaseAnalysisReport> => {
    return generateAndParseJson<CaseAnalysisReport>('gpt-4o-mini', systemInstruction, contentParts);
};


// --- Email Law Buddy ---

/**
 * Calls the OpenAI API to analyze an email and draft responses using gpt-4o-mini.
 */
export const analyzeAndDraftEmailResponses = (receivedEmail: string): Promise<EmailBuddyResponse> => {
    return generateAndParseJson<EmailBuddyResponse>(
        'gpt-4o-mini', 
        emailAnalyzerAndDrafterSystemPrompt, 
        receivedEmail
    );
};

/**
 * Calls the OpenAI API to explain a legal term using gpt-4o-mini.
 */
export const explainJargon = (term: string, context: string): Promise<{ explanation: string; suggested_question: string; }> => {
    const prompt = `Term: "${term}"\nContext: "${context}"`;
    return generateAndParseJson<{ explanation: string; suggested_question: string; }>(
        'gpt-4o-mini', 
        jargonExplanationSystemPrompt, 
        prompt
    );
};


// --- Incident Reporter ---

/**
 * Calls the OpenAI API to generate an incident report using gpt-3.5-turbo.
 */
export const generateIncidentReport = (data: IncidentData): Promise<IncidentReport> => {
    const prompt = `
        **Jurisdiction:** ${data.jurisdiction}
        **Incident Date:** ${data.incidentDate}
        **Location:** ${data.location}
        **Other Parties Involved:** ${data.otherPartiesInvolved.join(', ') || 'None specified'}
        **Children Present/Affected:** ${data.childrenPresent.join(', ') || 'None specified'}

        **User's Narrative:**
        ${data.narrative}
    `;

    return generateAndParseJson<IncidentReport>(
        'gpt-3.5-turbo', 
        incidentReportSystemPrompt,
        prompt
    );
};