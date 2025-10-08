import { IncidentReport, CaseAnalysisReport } from '../types/ai';

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
export const cleanAnalysisForSpeech = (analysis: CaseAnalysisReport): string => {
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
export const cleanReportForSpeech = (report: IncidentReport): string => {
    let speechText = `Incident Report. Title: ${report.title}. `;
    speechText += `Category: ${report.category}. Severity: ${report.severity}. Justification: ${report.severityJustification}. `;
    speechText += `Professional Summary: ${report.professionalSummary}. `;
    speechText += `Observed Impact: ${report.observedImpact}. `;
    speechText += `Legal Insights: ${report.legalInsights}. `;
    speechText += `AI Notes: ${report.aiNotes}.`;
    return cleanMarkdownForSpeech(speechText);
};


const externalLinkIconSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" class="w-3 h-3 inline-block ml-0.5 -mt-0.5"><path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" /><path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" /></svg>`;

/**
 * Finds potential mentions of legal legislation in a text and turns them into clickable search links.
 * @param text The text to process.
 * @param jurisdiction The jurisdiction to add to the search query.
 * @returns An HTML string with anchor tags embedded.
 */
export const linkifyLegislation = (text: string, jurisdiction: string): string => {
    if (!text) return '';
    // This regex looks for capitalized phrases ending with common legal document types.
    const legislationRegex = /\b([A-Z][A-Za-z\s'’.-]+? (Act|Code|Regulation|Regulations|Statute|Guidelines|Rules of Civil Procedure))\b/g;

    return text.replace(legislationRegex, (match) => {
        const query = encodeURIComponent(`${match} ${jurisdiction}`);
        const url = `https://www.google.com/search?q=${query}`;
        
        // Returns an anchor tag with styling and an embedded SVG for an external link icon.
        // 'not-prose' is used to prevent Tailwind's typography plugin from overriding these specific link styles.
        return `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-amber-300 hover:text-amber-200 hover:underline font-semibold not-prose">${match}${externalLinkIconSvg}</a>`;
    });
};

/**
 * Extracts a clean, readable domain name from a URL string.
 * @param url The full URL string.
 * @returns The cleaned domain name (e.g., "example.com").
 */
export const getDomainFromUrl = (url: string): string => {
    try {
        const urlObject = new URL(url);
        // Remove 'www.' if it exists
        return urlObject.hostname.replace(/^www\./, '');
    } catch (error) {
        // If the URL is malformed, return the original string as a fallback.
        console.warn(`Could not parse URL: ${url}`);
        return url;
    }
};
