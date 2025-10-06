/**
 * The maximum number of times to retry a failed API request.
 */
const MAX_RETRIES = 3;

/**
 * The initial delay in milliseconds before the first retry.
 * This delay will be doubled for each subsequent retry (exponential backoff).
 */
const INITIAL_DELAY_MS = 1000;

/**
 * A wrapper around the native `fetch` function that provides automatic retries with exponential backoff.
 * This makes API calls more resilient to transient network issues or temporary server unavailability.
 *
 * @param url - The URL to fetch.
 * @param options - The options for the fetch request (method, headers, body, etc.).
 * @returns A Promise that resolves to the `Response` object if the request is successful.
 * @throws The last error encountered after all retries have been exhausted.
 */
export const fetchWithRetry = async (url: string, options: RequestInit): Promise<Response> => {
    let lastError: Error | null = null;

    for (let i = 0; i < MAX_RETRIES; i++) {
        try {
            // Log the attempt for debugging purposes, especially on retries.
            if (i > 0) {
                console.log(`Retrying fetch for ${url}, attempt ${i + 1}/${MAX_RETRIES}...`);
            }
            
            const response = await fetch(url, options);

            if (!response.ok) {
                // If the response is not OK, try to parse the error from the body.
                // This is common for API errors that return a JSON with an error message.
                const errorData = await response.json().catch(() => ({})); // Gracefully handle non-JSON error responses.
                const errorMessage = errorData.error?.message || `API request failed with status ${response.status}`;
                const error = new Error(errorMessage);
                (error as any).status = response.status; // Attach status code for more specific handling.
                throw error;
            }
            
            // If the request was successful, return the response immediately.
            return response;

        } catch (error: any) {
            lastError = error;
            const delay = INITIAL_DELAY_MS * Math.pow(2, i);
            
            // Log a warning to the console that a retry is happening.
            console.warn(
                `Attempt ${i + 1} of ${MAX_RETRIES} failed for ${options.method || 'GET'} ${url}. ` +
                `Error: "${error.message}". Retrying in ${delay}ms...`
            );

            // If this isn't the last attempt, wait for the calculated delay before continuing.
            if (i < MAX_RETRIES - 1) {
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }

    // If all retries have failed, log the final error and throw it to be handled by the calling component.
    console.error(`All ${MAX_RETRIES} retries failed for ${options.method || 'GET'} ${url}. Last error:`, lastError);
    throw lastError;
};
