
// Fix: Refactor the entire AI service to use the @google/genai SDK instead of OpenAI.
import { GoogleGenAI, Type } from "@google/genai";
import { fileToDataUrl, pdfToText } from '../utils/fileUtils';
import { IncidentData, IncidentReport } from '../hooks/useIncidentReporter';
import { jargonExplanationSystemPrompt } from '../prompts';

// Fix: Initialize the Gemini client and export it for use in other parts of the app (e.g., live chat).
// The API key is now correctly sourced from environment variables as per guidelines.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/** Prepares the content parts for the Gemini API request from files and a text query. */
export const prepareContentParts = async (files: File[], query: string): Promise<any[]> => {
    const parts: any[] = [];
    
    // Add image parts first.
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const dataUrl = await fileToDataUrl(file);
            // Extract pure Base64 data from the data URL.
            const base64Data = dataUrl.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType: file.type,
                    data: base64Data
                }
            });
        }
    }
    
    let combinedText = '';
    // Aggregate all text-based content into a single string.
    for (const file of files) {
        if (file.type === 'application/pdf') {
            const extractedText = await pdfToText(file);
            combinedText += `\n\n--- START OF DOCUMENT: ${file.name} ---\n\n${extractedText}\n\n--- END OF DOCUMENT: ${file.name} ---\n\n`;
        }
    }

    if (query.trim()) {
        combinedText += `\n\n--- START OF PASTED TEXT ---\n\n${query}\n\n--- END OF PASTED TEXT ---\n\n`;
    }

    // Add the text part last, as it often contains the primary prompt.
    if (combinedText.trim()) {
        parts.push({ text: combinedText });
    }

    // If there are only images but no initial text prompt, add a default one.
    if (parts.length > 0 && !parts.some(p => p.text)) {
        parts.push({ text: 'Please extract and analyze the content of the attached image(s) based on your instructions.' });
    }
    
    return parts;
};

/**
 * Analyzes case documents using Gemini with multimodal capabilities.
 * @param parts - An array of content parts (text and/or images) for the model.
 * @param systemPrompt - The system instruction for the model.
 * @returns A promise that resolves to the generated text response.
 */
export const analyzeCaseDocuments = async (parts: any[], systemPrompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
            systemInstruction: systemPrompt,
        }
    });
    return response.text;
};

/**
 * Analyzes an email for tone, summary, and key demands using Gemini's JSON mode.
 * @param emailContent - The text content of the email to analyze.
 * @param systemPrompt - The system instruction for the model.
 * @returns A promise that resolves to the parsed JSON object.
 */
export const analyzeEmail = async (emailContent: string, systemPrompt: string): Promise<any> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: emailContent,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    tone: { type: Type.STRING, description: "A brief, descriptive label for the overall tone (e.g., Aggressive, Manipulative, Passive-Aggressive, Demanding, Factual, Business-like)." },
                    summary: { type: Type.STRING, description: "A one-sentence summary of the email's main purpose." },
                    key_demands: {
                        type: Type.ARRAY,
                        description: "A list of clear, actionable demands or questions made in the email. Extract these as direct, concise points.",
                        items: { type: Type.STRING }
                    },
                    legal_jargon: {
                        type: Type.ARRAY,
                        description: "An optional list of legal jargon found in the email.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                term: { type: Type.STRING, description: "The specific legal term identified." },
                                context: { type: Type.STRING, description: "The surrounding sentence where the term was found." }
                            },
                            required: ['term', 'context']
                        }
                    }
                },
                required: ['tone', 'summary', 'key_demands']
            }
        },
    });

    return JSON.parse(response.text);
};

/**
 * Generates a draft email response using Gemini.
 * @param userPrompt - The user's prompt, including the original email and key points.
 * @param systemPrompt - The system instruction for the model (e.g., BIFF or Grey Rock).
 * @returns A promise that resolves to the generated text of the draft email.
 */
export const generateDraftEmail = async (userPrompt: string, systemPrompt: string): Promise<string> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemPrompt,
            temperature: 0.7
        }
    });
    return response.text;
};

/**
 * Generates a structured incident report from a user's narrative using Gemini's JSON mode.
 * @param incidentData - The raw data of the incident provided by the user.
 * @param systemPrompt - The system instruction for the AI model.
 * @returns A promise that resolves to the parsed JSON object of the incident report.
 */
export const generateIncidentReport = async (incidentData: IncidentData, systemPrompt: string): Promise<IncidentReport> => {
    const userPrompt = `
Please analyze the following incident and generate a structured report.

**Incident Date & Time:** ${incidentData.dateTime}
**Location:** ${incidentData.location}
**Parties Involved:** ${incidentData.involvedParties}
**Jurisdiction for Legal Context:** ${incidentData.jurisdiction}

**User's Narrative of the Incident:**
---
${incidentData.narrative}
---
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: systemPrompt,
            tools: [{googleSearch: {}}],
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    professionalSummary: {
                        type: Type.STRING,
                        description: "A comprehensive 2-3 paragraph professional summary of the incident, removing emotional language but preserving all factual details."
                    },
                    observedImpact: {
                        type: Type.ARRAY,
                        description: "A list of observable impacts on the children or the parenting arrangement, based on the narrative.",
                        items: { type: Type.STRING }
                    },
                    legalInsights: {
                        type: Type.ARRAY,
                        description: "A list of potential legal arguments or strategies based on web-searched legislation for the given jurisdiction.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                insight: { 
                                    type: Type.STRING, 
                                    description: "The strategic insight or potential legal argument." 
                                },
                                legislation: { 
                                    type: Type.STRING, 
                                    description: "The name of the relevant act, statute, or legal principle found via web search." 
                                },
                                sourceUrl: { 
                                    type: Type.STRING, 
                                    description: "A direct URL to the legal source or an authoritative explanation." 
                                }
                            },
                            required: ['insight', 'legislation', 'sourceUrl']
                        }
                    }
                },
                required: ['professionalSummary', 'observedImpact', 'legalInsights']
            }
        },
    });

    return JSON.parse(response.text);
};

/**
 * Explains a legal term and suggests a clarification question using Gemini.
 * @param term The legal term to explain.
 * @param context The context in which the term was used.
 * @returns A promise that resolves to an object with the explanation and suggested question.
 */
export const explainJargon = async (term: string, context: string): Promise<{ explanation: string; suggested_question: string; }> => {
    const userPrompt = `Please explain the following legal term:

Term: "${term}"
Context: "${context}"
`;

    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
            systemInstruction: jargonExplanationSystemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    explanation: { type: Type.STRING, description: "A clear, simple explanation of the legal term." },
                    suggested_question: { type: Type.STRING, description: "A polite, BIFF-style question for clarification." }
                },
                required: ['explanation', 'suggested_question']
            }
        },
    });

    return JSON.parse(response.text);
};
