/**
 * A robust markdown-to-HTML converter for the expected AI response format.
 * This function handles the conversion of common markdown syntax into styled HTML elements.
 * Supported features:
 * - Bold (`**text**`) and Italic (`*text*` or `_text_`)
 * - Inline code (` `code` `)
 * - Unordered lists (`*`, `+`, or `-` item)
 * - Ordered lists (`1. item`)
 * - Fenced code blocks (```code```)
 * - Tables (`| th | th |\n|:--|:--|\n| td | td |`)
 * - Paragraphs (groups consecutive lines, separated by blank lines)
 */
export const formatMarkdown = (text: string): string => {
    if (!text) return '';

    const processInlineFormatting = (str: string): string => {
        return str
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>') // Bold + Italic
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')       // Bold
            .replace(/\*(.*?)\*/g, '<em>$1</em>')         // Italic
            .replace(/_([^_]+)_/g, '<em>$1</em>')       // Italic (underscore)
            .replace(/`([^`]+)`/g, '<code class="bg-slate-700 text-amber-300 px-1 py-0.5 rounded text-sm font-mono">$1</code>'); // Inline code
    };

    const lines = text.split('\n');
    let html = '';
    
    // State variables
    let listType: 'ul' | 'ol' | null = null;
    let inCodeBlock = false;
    let codeBlockContent = '';
    let paragraphBuffer: string[] = [];

    const flushParagraphBuffer = () => {
        if (paragraphBuffer.length > 0) {
            html += `<p class="mb-4">${processInlineFormatting(paragraphBuffer.join(' '))}</p>`;
            paragraphBuffer = [];
        }
    };
    
    const closeList = () => {
        if (listType === 'ul') html += '</ul>';
        if (listType === 'ol') html += '</ol>';
        listType = null;
    };

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];

        if (line.trim().startsWith('```')) {
            flushParagraphBuffer();
            closeList();
            if (inCodeBlock) {
                const escapedCode = codeBlockContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
                html += `<pre class="bg-slate-950 p-4 rounded-md overflow-x-auto mb-4"><code class="text-white text-sm font-mono">${escapedCode.trim()}</code></pre>`;
                inCodeBlock = false;
                codeBlockContent = '';
            } else {
                inCodeBlock = true;
            }
            continue;
        }
        
        if (inCodeBlock) {
            codeBlockContent += line + '\n';
            continue;
        }

        if (line.trim() === '') {
            flushParagraphBuffer();
            closeList();
            continue;
        }

        const isTableSeparator = (l: string) => /^\s*\|?(:?-+:?\|)+(:?-+:?)?\s*$/.test(l.trim());
        const isTableRow = (l: string) => l.trim().startsWith('|') && l.trim().endsWith('|');

        if (isTableRow(line) && (i + 1 < lines.length) && isTableSeparator(lines[i + 1])) {
            flushParagraphBuffer();
            closeList();

            html += '<div class="overflow-x-auto mb-4 rounded-lg border border-slate-700"><table class="w-full text-sm text-left text-gray-300">';
            
            const headerCells = line.split('|').slice(1, -1);
            html += '<thead class="text-xs text-gray-200 uppercase bg-slate-700">';
            html += '<tr>';
            headerCells.forEach(cell => {
                html += `<th scope="col" class="px-4 py-3 font-semibold">${processInlineFormatting(cell.trim())}</th>`;
            });
            html += '</tr></thead>';

            html += '<tbody>';
            let tableRowIndex = i + 2;
            while (tableRowIndex < lines.length && isTableRow(lines[tableRowIndex])) {
                const rowCells = lines[tableRowIndex].split('|').slice(1, -1);
                html += '<tr class="bg-slate-800 border-t border-slate-700 hover:bg-slate-700">';
                for(let k = 0; k < headerCells.length; k++) {
                     const cellContent = rowCells[k] ? rowCells[k].trim() : '';
                     html += `<td class="px-4 py-3">${processInlineFormatting(cellContent)}</td>`;
                }
                html += '</tr>';
                tableRowIndex++;
            }
            html += '</tbody></table></div>';
            
            i = tableRowIndex - 1; 
            continue;
        }
        
        const ulMatch = line.match(/^\s*([*+-])\s+(.*)/);
        const olMatch = line.match(/^\s*(\d+)\.\s+(.*)/);

        if (ulMatch) {
            flushParagraphBuffer();
            if (listType !== 'ul') {
                closeList(); // Close ol if it was open
                html += '<ul class="list-disc pl-6 space-y-2 mb-4">';
                listType = 'ul';
            }
            html += `<li>${processInlineFormatting(ulMatch[2])}</li>`;
        } else if (olMatch) {
            flushParagraphBuffer();
            if (listType !== 'ol') {
                closeList(); // Close ul if it was open
                html += '<ol class="list-decimal pl-6 space-y-2 mb-4">';
                listType = 'ol';
            }
            html += `<li>${processInlineFormatting(olMatch[2])}</li>`;
        } else {
            closeList();
            paragraphBuffer.push(line.trim());
        }
    }

    flushParagraphBuffer();
    closeList();
    if (inCodeBlock) {
        const escapedCode = codeBlockContent.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
        html += `<pre class="bg-slate-950 p-4 rounded-md overflow-x-auto mb-4"><code class="text-white text-sm font-mono">${escapedCode.trim()}</code></pre>`;
    }

    return html;
};