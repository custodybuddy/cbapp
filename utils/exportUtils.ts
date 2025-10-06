
/**
 * Creates a text file from a string and initiates a download.
 * @param content The string content for the file.
 * @param filename The desired name of the downloaded file.
 */
export const exportTextFile = (content: string, filename: string): void => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
};


/**
 * Exports a specific HTML element as a PDF document, preserving its styling.
 * This function relies on jsPDF and html2canvas, which must be loaded globally.
 * @param element - The HTML element to capture and export.
 * @param filename - The desired name of the downloaded PDF file.
 * @param headerText - Optional text to display in the header of each page.
 */
export const exportElementAsPDF = async (element: HTMLElement, filename:string, headerText?: string): Promise<void> => {
    const { jsPDF } = (window as any).jspdf;
    const html2canvas = (window as any).html2canvas;

    if (!jsPDF || !html2canvas) {
        console.error("jsPDF or html2canvas library not loaded.");
        alert("PDF export functionality is currently unavailable. Please try again later.");
        return;
    }

    const elementsToHide = element.querySelectorAll<HTMLElement>('.no-pdf');
    elementsToHide.forEach(el => { el.style.display = 'none'; });

    const canvas = await html2canvas(element, {
        scale: 2, // Use a higher scale for better resolution
        backgroundColor: '#0f172a', // slate-900 color for consistency
        useCORS: true,
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
    });

    elementsToHide.forEach(el => { el.style.display = ''; });

    const imgData = canvas.toDataURL('image/png');
    const imgWidth = canvas.width;
    const imgHeight = canvas.height;

    const pdf = new jsPDF({ orientation: 'p', unit: 'px', format: 'a4' });
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();

    // Calculate the aspect ratio to fit the image to the PDF's width
    const ratio = pdfWidth / imgWidth;
    const canvasHeightInPdf = imgHeight * ratio;

    const totalPages = Math.ceil(canvasHeightInPdf / pdfHeight);

    for (let i = 0; i < totalPages; i++) {
        if (i > 0) {
            pdf.addPage();
        }
        
        const position = -pdfHeight * i;
        pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, canvasHeightInPdf);

        // Add header
        if (headerText) {
            pdf.setFontSize(9);
            pdf.setTextColor(150);
            pdf.text(headerText, 15, 20);
        }

        // Add footer (page numbers)
        const pageNumText = `Page ${i + 1} of ${totalPages}`;
        pdf.setFontSize(9);
        pdf.setTextColor(150);
        const textWidth = pdf.getStringUnitWidth(pageNumText) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
        const x = (pdfWidth - textWidth) / 2;
        pdf.text(pageNumText, x, pdfHeight - 15);
    }

    pdf.save(filename);
};
