import { z } from 'zod';

// --- Type for Incident Report Feature ---
export interface IncidentData {
    dateTime: string;
    location: string;
    involvedParties: string;
    narrative: string;
    jurisdiction: string;
}

// --- Zod Schemas for Runtime Validation ---

export const CaseAnalysisReportSchema = z.object({
    documentTypes: z.array(z.object({
        type: z.string(),
        source: z.string(),
    })),
    summary: z.string(),
    keyClauses: z.array(z.object({
        clause: z.string(),
        explanation: z.string(),
        source: z.string(),
    })),
    discrepancies: z.array(z.object({
        description: z.string(),
        sources: z.array(z.string()),
    })),
    legalJargon: z.array(z.object({
        term: z.string(),
        explanation: z.string(),
    })).optional(),
    actionItems: z.array(z.object({
        item: z.string(),
        deadline: z.string().optional(),
        source: z.string(),
    })).optional(),
    suggestedNextSteps: z.string(),
    strategicCommunication: z.object({
        recommendation: z.string(),
        draftEmail: z.string(),
    }).optional(),
    disclaimer: z.string(),
});
export type CaseAnalysisReport = z.infer<typeof CaseAnalysisReportSchema>;

const EmailAnalysisSchema = z.object({
    tone: z.string(),
    summary: z.string(),
    key_demands: z.array(z.string()),
    legal_jargon: z.array(z.object({
        term: z.string(),
        context: z.string(),
    })).optional(),
});
export type EmailAnalysis = z.infer<typeof EmailAnalysisSchema>;

export const EmailBuddyResponseSchema = z.object({
    analysis: EmailAnalysisSchema,
    drafts: z.object({
        biff: z.string(),
        greyRock: z.string(),
        friendlyAssertive: z.string(),
    })
});
export type EmailBuddyResponse = z.infer<typeof EmailBuddyResponseSchema>;


export const IncidentReportSchema = z.object({
    title: z.string().describe("Brief descriptive title of the incident"),
    category: z.enum([
        "Child Safety/Welfare Concern", 
        "Communication Issues", 
        "Schedule Violations", 
        "Breach of Court Order", 
        "Parental Alienation", 
        "Inappropriate Behavior", 
        "Financial Disputes", 
        "Other"
    ]).describe("The category of the incident"),
    severity: z.enum(["Low", "Medium", "High"]).describe("The severity of the incident"),
    severityJustification: z.string().describe("Justification for the severity rating"),
    professionalSummary: z.string().describe("Objective summary of the incident"),
    observedImpact: z.string().describe("Analysis of the impact on children"),
    legalInsights: z.string().describe("Analysis of relevant family law principles"),
    sources: z.array(z.string()).describe("List of potential legal or informational sources"),
    aiNotes: z.string().describe("AI notes on documentation and evidence"),
});
export type IncidentReport = z.infer<typeof IncidentReportSchema>;

export const JargonExplanationSchema = z.object({
    explanation: z.string(),
    suggested_question: z.string(),
});
export type JargonExplanation = z.infer<typeof JargonExplanationSchema>;
