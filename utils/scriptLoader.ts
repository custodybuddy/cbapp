const loadedScripts: { [src: string]: Promise<void> } = {};

/**
 * Dynamically loads a script into the document head and returns a promise that resolves when it's loaded.
 * Ensures that the same script is not loaded multiple times.
 * @param src The URL of the script to load.
 * @returns A promise that resolves on load or rejects on error.
 */
export const loadScript = (src: string): Promise<void> => {
    // If the script is already loading or has loaded, return the existing promise.
    if (loadedScripts[src]) {
        return loadedScripts[src];
    }

    const promise = new Promise<void>((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.async = true;
        script.onload = () => {
            resolve();
        };
        script.onerror = () => {
            // On error, remove the promise from the cache to allow retries.
            delete loadedScripts[src];
            reject(new Error(`Failed to load script: ${src}`));
        };
        document.body.appendChild(script);
    });

    loadedScripts[src] = promise;
    return promise;
};