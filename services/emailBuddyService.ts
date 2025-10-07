import { Type } from "@google/genai";
import { ai } from './geminiClient';
import { 
    EmailBuddyResponseSchema, 
    EmailBuddyResponse,
    JargonExplanationSchema,
    JargonExplanation
} from '../types/ai';
import { emailAnalyzerAndDrafterSystemPrompt, jargonExplanationSystemPrompt } from '../prompts';


/**
 * Analyzes an email and generates multiple draft responses in a single call.
 * @param emailContent - The text content of the email to analyze.
 * @param systemPrompt - The system instruction for the model.
 * @returns A promise that resolves to the parsed JSON object containing analysis and drafts.
 */
export const analyzeAndDraftEmailResponses = async (emailContent: string, systemPrompt: string): Promise<EmailBuddyResponse> => {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: emailContent,
        config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
                type: Type.OBJECT,
                properties: {
                    analysis: {
                        type: Type.OBJECT,
                        properties: {
                            tone: { type: Type.STRING },
                            summary: { type: Type.STRING },
                            key_demands: { type: Type.ARRAY, items: { type: Type.STRING } },
                            legal_jargon: {
                                type: Type.ARRAY,
                                items: {
                                    type: Type.OBJECT,
                                    properties: {
                                        term: { type: Type.STRING },
                                        context: { type: Type.STRING }
                                    },
                                    required: ['term', 'context']
                                }
                            }
                        },
                        required: ['tone', 'summary', 'key_demands']
                    },
                    drafts: {
                        type: Type.OBJECT,
                        properties: {
                            biff: { type: Type.STRING, description: "A draft using the BIFF method." },
                            greyRock: { type: Type.STRING, description: "A draft using the Grey Rock method." },
                            friendlyAssertive: { type: Type.STRING, description: "A draft using the Friendly Assertive method." }
                        },
                        required: ['biff', 'greyRock', 'friendlyAssertive']
                    }
                },
                required: ['analysis', 'drafts']
            }
        },
    });
    
    const parsedJson = JSON.parse(response.text);
    return EmailBuddyResponseSchema.parse(parsedJson);
};

/**
 * Explains a legal term and suggests a clarification question using Gemini.
 * @param term The legal term to explain.
 * @param context The context in which the term was used.
 * @returns A promise that resolves to an object with the explanation and suggested question.
 */
export const explainJargon = async (term: string, context: string): Promise<JargonExplanation> => {
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

    const parsedJson = JSON.parse(response.text);
    return JargonExplanationSchema.parse(parsedJson);
};
