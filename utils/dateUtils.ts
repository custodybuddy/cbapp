
/**
 * Formats the current date into a human-readable string.
 * e.g., "September 1, 2024"
 * @returns A formatted date string.
 */
export const getFormattedDate = (): string => {
    return new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
};

/**
 * Gets the current date in YYYY-MM-DD format.
 * @returns A formatted date string.
 */
export const getISODate = (): string => {
    return new Date().toISOString().split('T')[0];
};
