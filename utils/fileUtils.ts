/** Converts an image File object to a Base64 data URL. */
export const fileToDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });
};

/** Extracts text content from a PDF file using pdf.js. */
export const pdfToText = (file: File): Promise<string> => {
    // This function relies on the pdf.js library being loaded globally from a CDN.
    const pdfjsLib = (window as any).pdfjsLib;
    if (!pdfjsLib) {
        return Promise.reject(new Error("PDF library is not loaded."));
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsArrayBuffer(file);
        reader.onload = async () => {
            try {
                const loadingTask = pdfjsLib.getDocument({ data: reader.result });
                const pdf = await loadingTask.promise;
                let textContent = '';
                for (let i = 1; i <= pdf.numPages; i++) {
                    const page = await pdf.getPage(i);
                    const text = await page.getTextContent();
                    textContent += text.items.map((item: any) => item.str).join(' ');
                    if (i < pdf.numPages) {
                        textContent += '\n\n--- Page Break ---\n\n';
                    }
                }
                resolve(textContent);
            } catch (error) {
                console.error('Error parsing PDF:', error);
                reject(new Error('Failed to parse PDF. It may be corrupted or password-protected.'));
            }
        };
        reader.onerror = (error) => reject(error);
    });
};