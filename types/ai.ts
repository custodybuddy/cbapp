export type Persona = 'Strategic Advisor' | 'Strict but Fair' | 'Empathetic Listener';

export type ToneOption =
  | "BIFF"
  | "Grey Rock"
  | "Friendly Assertive"
  | "Professional (for Lawyers)"
  | "Passive (not recommended)"
  | "Passive-Aggressive (not recommended)"
  | "Aggressive (not recommended)";

export interface JargonItem {
  term: string;
  context: string;
}

export interface EmailAnalysis {
    tone: string;
    summary: string;
    key_demands: string[];
    legal_jargon: JargonItem[];
}
  
export interface EmailDrafts {
    biff: string;
    greyRock: string;
    friendlyAssertive: string;
}
  
export interface EmailBuddyResponse {
    analysis: EmailAnalysis;
    drafts: EmailDrafts;
}

export interface CaseAnalysisReport {
    documentTypes: { type: string; source: string; }[];
    summary: string;
    keyClauses: { clause: string; explanation: string; source: string; }[];
    discrepancies: { description: string; sources: string[]; }[];
    legalJargon: { term: string; explanation: string; }[];
    actionItems: { item: string; deadline?: string; source: string; }[];
    suggestedNextSteps: string;
    strategicCommunication?: {
        recommendation: string;
        draftEmail: string;
    };
    disclaimer: string;
}

export type IncidentCategory = 
    | 'Communication Issue'
    | 'Schedule Violation'
    | 'Financial Dispute'
    | 'Child Safety Concern'
    | 'Parental Alienation'
    | 'Legal/Court Matter'
    | 'Other';

export interface IncidentData {
    narrative: string;
    jurisdiction: string;
    incidentDate: string;
    otherPartiesInvolved: string[];
    childrenPresent: string[];
    location: string;
}

export interface IncidentReport {
    title: string;
    category: IncidentCategory;
    severity: 'Low' | 'Medium' | 'High';
    severityJustification: string;
    professionalSummary: string;
    observedImpact: string;
    legalInsights: string;
    sources: string[];
    aiNotes: string;
}