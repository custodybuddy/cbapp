/**
 * Cleans a markdown string to make it more suitable for text-to-speech.
 * Removes formatting like bold, italics, code, lists, and links.
 * @param markdownText The markdown string to clean.
 * @returns A plain text string.
 */
export const cleanMarkdownForSpeech = (markdownText: string): string => {
    // Basic markdown removal for better speech flow
    return markdownText
        .replace(/\*\*(.*?)\*\*/g, '$1')
        .replace(/\*(.*?)\*/g, '$1')
        .replace(/_([^_]+)_/g, '$1')
        .replace(/`([^`]+)`/g, '$1')
        .replace(/#{1,6}\s/g, '')
        .replace(/\[(.*?)\]\(.*?\)/g, '$1')
        .replace(/(\*|\+|-)\s/g, '')
        .replace(/---|===/g, '')
        .replace(/\|/g, ', ')
        .trim();
};

/**
 * Cleans a draft email string for text-to-speech.
 * Removes the subject line and placeholder brackets.
 * @param emailText The email draft string.
 * @returns A plain text string.
 */
export const cleanEmailForSpeech = (emailText: string): string => {
    return emailText
        .replace(/Subject: Re: .*\n\n/i, '')
        .replace(/\[(.*?)\]/g, '$1')
        .trim();
};


/**
 * Cleans a structured case analysis object and formats it into a single plain text string for text-to-speech.
 * @param analysis The structured analysis object.
 * @returns A plain text string suitable for speech synthesis.
 */
export const cleanAnalysisForSpeech = (analysis: any): string => {
    let speechText = "AI Analysis. ";

    if (analysis.summary) {
        speechText += "Summary: " + analysis.summary + ". ";
    }
    if (analysis.keyClauses && analysis.keyClauses.length > 0) {
        speechText += "Key Clauses and Obligations: ";
        speechText += analysis.keyClauses.map((c: any) => `${c.clause}: ${c.explanation}`).join('. ');
        speechText += ". ";
    }
    if (analysis.discrepancies && analysis.discrepancies.length > 0) {
        speechText += "Potential Discrepancies and Flags: ";
        speechText += analysis.discrepancies.map((d: any) => d.description).join('. ');
        speechText += ". ";
    }
    if (analysis.actionItems && analysis.actionItems.length > 0) {
        speechText += "Action Items and Deadlines: ";
        speechText += analysis.actionItems.map((item: any) => item.item).join('. ');
        speechText += ". ";
    }
    if (analysis.suggestedNextSteps) {
        speechText += "Suggested Next Steps: " + analysis.suggestedNextSteps + ". ";
    }
    
    return cleanMarkdownForSpeech(speechText);
};

/**
 * Cleans an incident report object and formats it into a single plain text string for text-to-speech.
 * @param report The IncidentReport object.
 * @returns A plain text string suitable for speech synthesis.
 */
export const cleanReportForSpeech = (report: {
    professionalSummary: string;
    observedImpact: string[];
    legalInsights: Array<{ insight: string; legislation: string; }>;
}): string => {
    let speechText = "Incident Report. ";
    
    speechText += "Professional Summary: ";
    speechText += report.professionalSummary;
    speechText += ". ";

    speechText += "Observed Impact: ";
    speechText += report.observedImpact.join('. ');
    speechText += ". ";

    speechText += "Legal Insights and Strategy: ";
    report.legalInsights.forEach((item, index) => {
        speechText += `Insight ${index + 1}: ${item.insight}. `;
        speechText += `This is based on the following legislation: ${item.legislation}. `;
    });
    
    return cleanMarkdownForSpeech(speechText);
};