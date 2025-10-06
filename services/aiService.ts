// Fix: Refactor the entire AI service to use the @google/genai SDK instead of OpenAI.
import { GoogleGenAI, Type } from "@google/genai";
import { fileToDataUrl, pdfToText } from '../utils/fileUtils';
import { IncidentData, IncidentReport } from '../hooks/useIncidentReporter';
import { jargonExplanationSystemPrompt } from '../prompts';

// Fix: Initialize the Gemini client and export it for use in other parts of the app (e.g., live chat).
// The API key is now correctly sourced from environment variables as per guidelines.
export const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Define the interface for the structured analysis response.
export interface CaseAnalysisReport {
    documentTypes: Array<{ type: string; source: string; }>;
    summary: string;
    keyClauses: Array<{ clause: string; explanation: string; source: string; }>;
    discrepancies: Array<{ description: string; sources: string[]; }>;
    legalJargon: Array<{ term: string; explanation:string; }>;
    actionItems: Array<{ item: string; deadline?: string; source: string; }>;
    suggestedNextSteps: string; // Markdown formatted
    disclaimer: string;
}


/** Prepares the content parts for the Gemini API request from files and a text query. */
export const prepareContentParts = async (files: File[], query: string): Promise<any[]> => {
    const parts: any[] = [];
    
    // Process all files and aggregate text content.
    let combinedText = '';
    for (const file of files) {
        if (file.type.startsWith('image/')) {
            const dataUrl = await fileToDataUrl(file);
            const base64Data = dataUrl.split(',')[1];
            parts.push({
                inlineData: {
                    mimeType: file.type,
                    data: base64Data
                }
            });
        } else if (file.type === 'application/pdf') {
            const extractedText = await pdfToText(file);
            combinedText += `\n\n--- START OF DOCUMENT: ${file.name} ---\n\n${extractedText}\n\n--- END OF DOCUMENT: ${file.name} ---\n\n`;
        }
    }

    // Add pasted text from the user.
    if (query.trim()) {
        combinedText += `\n\n--- START OF PASTED TEXT ---\n\n${query}\n\n--- END OF PASTED TEXT ---\n\n`;
    }

    // Add the combined text as the final part.
    if (combinedText.trim()) {
        parts.push({ text: combinedText });
    }

    return parts;
};

/**
 * Analyzes case documents using Gemini with JSON mode for a structured response.
 * @param parts - An array of content parts (text and/or images) for the model.
 * @param systemPrompt - The system instruction for the model.
 * @returns A promise that resolves to the parsed JSON object of the analysis.
 */
export const analyzeCaseDocuments = async (parts: any[], systemPrompt: string): Promise<CaseAnalysisReport> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: { parts },
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    documentTypes: {
                        type: Type.ARRAY,
                        description: "List of identified document types.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                type: { type: Type.STRING, description: "e.g., 'Court Order', 'Email Correspondence'" },
                                source: { type: Type.STRING, description: "Filename or 'Pasted Text'" },
                            },
                             required: ['type', 'source']
                        }
                    },
                    summary: { type: Type.STRING, description: "Plain English summary." },
                    keyClauses: {
                        type: Type.ARRAY,
                        description: "Key clauses, obligations, or rules found in the documents.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                clause: { type: Type.STRING, description: "A direct quote or summary of the clause." },
                                explanation: { type: Type.STRING, description: "A simple explanation of what it means." },
                                source: { type: Type.STRING, description: "The filename or source of the clause." },
                            },
                             required: ['clause', 'explanation', 'source']
                        }
                    },
                    discrepancies: {
                        type: Type.ARRAY,
                        description: "Conflicts or contradictions between the provided documents.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                description: { type: Type.STRING, description: "A clear description of the discrepancy." },
                                sources: { type: Type.ARRAY, items: { type: Type.STRING }, description: "A list of the filenames involved in the conflict." },
                            },
                             required: ['description', 'sources']
                        }
                    },
                    legalJargon: {
                        type: Type.ARRAY,
                        description: "Legal terms that might be confusing.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                term: { type: Type.STRING },
                                explanation: { type: Type.STRING, description: "A simple definition." },
                            },
                            required: ['term', 'explanation']
                        }
                    },
                    actionItems: {
                        type: Type.ARRAY,
                        description: "Deadlines or actions required of the user.",
                        items: {
                            type: Type.OBJECT,
                            properties: {
                                item: { type: Type.STRING, description: "The required action." },
                                deadline: { type: Type.STRING, description: "Optional deadline, e.g., YYYY-MM-DD" },
                                source: { type: Type.STRING, description: "The source document for the action item." },
                            },
                             required: ['item', 'source']
                        }
                    },
                    suggestedNextSteps: { type: Type.STRING, description: "Markdown formatted string of next steps." },
                    disclaimer: { type: Type.STRING, description: "Mandatory legal disclaimer." }
                },
                required: ['documentTypes', 'summary', 'keyClauses', 'discrepancies', 'suggestedNextSteps', 'disclaimer']
            }
        }
    });
    
    return JSON.parse(response.text);
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