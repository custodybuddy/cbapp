/**
 * Returns a user-friendly error message based on an error from an API call or browser action.
 * This function inspects the error type and message for keywords to provide more specific
 * and actionable feedback to the user, while also logging detailed info for developers.
 * @param error - The error object caught from a try/catch block.
 * @param context - A string describing the action that failed (e.g., "document analysis").
 * @returns A user-friendly error string.
 */
export const getFriendlyErrorMessage = (error: unknown, context: string): string => {
    // Log the full error for developers
    console.error(`Error during [${context}]:`, error);

    const defaultMessage = `An unexpected error occurred during ${context}. Please try again later. If the problem persists, please contact support.`;

    if (error instanceof Error) {
        // Handle microphone/media access errors (common in live chat)
        if (error.name === 'NotAllowedError' || error.message.includes('Permission denied')) {
            return 'Microphone access was denied. Please allow microphone access in your browser settings to use this feature.';
        }
        if (error.name === 'NotFoundError' || error.message.includes('not found') && (context.includes('microphone') || context.includes('chat'))) {
            return 'No microphone was found. Please ensure a microphone is connected and enabled.';
        }
        if (error.name === 'NotReadableError' || error.message.includes('hardware error')) {
            return 'There was a hardware error with your microphone. Please check your microphone connection and try again.';
        }

        const message = error.message.toLowerCase();
        
        // Handle Gemini-specific API errors from the message
        if (message.includes('api key not valid')) {
            return `Authentication Error: The AI service is not configured correctly. Please contact support.`;
        }
        if (message.includes('quota')) {
            return `Quota Exceeded: The AI service has reached its usage limit. Please try again later.`;
        }
        if (message.includes('resource has been exhausted')) {
            return `Rate Limit Reached: The AI service is experiencing high traffic. Please wait a moment before trying again.`;
        }
        if (message.includes('service is currently unavailable')) {
            return `Server Error: The AI service is temporarily unavailable. Please try again in a few minutes.`;
        }
        if (message.includes('safety')) {
            return `Content Moderation: Your request was blocked by safety filters. Please revise your input and try again.`;
        }
        if (message.includes('404') && message.includes('not found')) {
            return `API Error (404): A resource was not found. This might be due to an incorrect model name. Please contact support.`;
        }

        // Generic network error
        if (message.includes('failed to fetch') || error.name === 'TypeError') {
            return 'Network Error: Please check your internet connection and try again.';
        }

        // For other generic errors, provide a helpful message that includes the original error text
        return `An error occurred: ${error.message}. Please try again.`;
    }

    if (typeof error === 'string') {
        return `An error occurred: ${error}. Please try again.`;
    }

    return defaultMessage;
};