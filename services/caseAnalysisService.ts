import { Type } from "@google/genai";
import { z } from 'zod';
import { ai } from './geminiClient';
import { CaseAnalysisReportSchema, CaseAnalysisReport } from '../types/ai';
import { fileToDataUrl, pdfToText } from '../utils/fileUtils';


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
                    strategicCommunication: {
                        type: Type.OBJECT,
                        description: "A strategic recommendation and draft email to address the most critical issue found.",
                        properties: {
                            recommendation: { type: Type.STRING, description: "A brief explanation of why this communication is suggested." },
                            draftEmail: { type: Type.STRING, description: "A BIFF-style draft email." }
                        },
                        required: ['recommendation', 'draftEmail']
                    },
                    disclaimer: { type: Type.STRING, description: "Mandatory legal disclaimer." }
                },
                required: ['documentTypes', 'summary', 'keyClauses', 'discrepancies', 'suggestedNextSteps', 'disclaimer']
            }
        }
    });
    
    let parsedJson;
    try {
        let jsonText = response.text.trim();
        if (jsonText.startsWith('```json')) {
            jsonText = jsonText.substring(7).trim();
        } else if (jsonText.startsWith('```')) {
            jsonText = jsonText.substring(3).trim();
        }
        if (jsonText.endsWith('```')) {
            jsonText = jsonText.slice(0, -3).trim();
        }
        parsedJson = JSON.parse(jsonText);
    } catch (e) {
        console.error("Failed to parse AI response as JSON:", e);
        console.error("Raw response text:", response.text);
        throw new Error("The AI returned an invalid response that could not be understood. This might be a temporary issue. Please try again.");
    }

    const result = CaseAnalysisReportSchema.safeParse(parsedJson);

    if (!result.success) {
        console.error("AI response did not match expected schema:", result.error.issues);
        console.error("Parsed JSON object:", parsedJson);
        const firstIssue = result.error.issues[0];
        const path = firstIssue.path.join('.');
        const message = `The AI response was missing or had an incorrect format for the '${path}' field. Please try your request again.`;
        throw new Error(message);
    }

    return result.data;
};