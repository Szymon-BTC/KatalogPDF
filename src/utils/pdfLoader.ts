import * as pdfjsLib from 'pdfjs-dist';
import { CatalogPage, SearchResult } from '../types';

// Configure pdfjs worker URL
if (typeof window !== 'undefined') {
  // Use cdnjs or unpkg fallback for worker script to avoid bundler path issues
  const PDFJS_VERSION = pdfjsLib.version || '4.10.38';
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}/pdf.worker.min.mjs`;
}

export interface PdfLoadProgressCallback {
  (current: number, total: number, message: string): void;
}

/**
 * Loads a PDF file buffer, renders high resolution images for each page,
 * extracts raw page text for search and AI analysis.
 */
export async function loadPdfPagesFromArrayBuffer(
  arrayBuffer: ArrayBuffer,
  onProgress?: PdfLoadProgressCallback,
  scale?: number
): Promise<{ pages: CatalogPage[]; title: string }> {
  const dpr = typeof window !== 'undefined' ? Math.max(1, window.devicePixelRatio || 1) : 1;
  const renderScale = scale ?? Math.max(2.0, dpr * 1.5); // HiDPI dynamic scale

  if (onProgress) onProgress(0, 0, 'Inicjalizacja dekodera PDF...');

  const loadingTask = pdfjsLib.getDocument({
    data: arrayBuffer,
    cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@4.10.38/cmaps/',
    cMapPacked: true,
  });

  const pdfDoc = await loadingTask.promise;
  const numPages = pdfDoc.numPages;

  let docTitle = 'Katalog PDF';
  try {
    const metadata = await pdfDoc.getMetadata();
    if (metadata.info && (metadata.info as any).Title) {
      docTitle = (metadata.info as any).Title;
    }
  } catch (e) {
    // metadata optional
  }

  const pages: CatalogPage[] = [];

  for (let i = 1; i <= numPages; i++) {
    if (onProgress) {
      onProgress(i, numPages, `Renderowanie strony ${i} z ${numPages}...`);
    }

    const page = await pdfDoc.getPage(i);
    const viewport = page.getViewport({ scale: renderScale });

    // Render page to canvas with HiDPI support
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');

    canvas.width = Math.floor(viewport.width);
    canvas.height = Math.floor(viewport.height);

    if (context) {
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = 'high';

      const renderContext = {
        canvasContext: context,
        viewport: viewport,
        canvas: canvas,
      };

      await page.render(renderContext).promise;
    }

    const dataUrl = canvas.toDataURL('image/jpeg', 0.88);

    // Extract text content for search and AI
    let extractedText = '';
    try {
      const textContent = await page.getTextContent();
      extractedText = textContent.items
        .map((item: any) => item.str)
        .join(' ')
        .replace(/\s+/g, ' ');
    } catch (err) {
      console.warn(`Could not extract text for page ${i}:`, err);
    }

    pages.push({
      pageIndex: i - 1,
      pageNumber: i,
      dataUrl,
      text: extractedText,
      width: canvas.width,
      height: canvas.height,
    });
  }

  return { pages, title: docTitle };
}

/**
 * Utility to search for a query string across pages
 */
export function searchInPages(pages: CatalogPage[], query: string): SearchResult[] {
  if (!query || query.trim().length < 2) return [];

  const normalizedQuery = query.toLowerCase().trim();
  const results: SearchResult[] = [];

  pages.forEach((page) => {
    const textLower = page.text.toLowerCase();
    const matchIdx = textLower.indexOf(normalizedQuery);
    if (matchIdx !== -1) {
      // Create snippet
      const start = Math.max(0, matchIdx - 30);
      const end = Math.min(page.text.length, matchIdx + normalizedQuery.length + 50);
      const snippet = '...' + page.text.substring(start, end) + '...';

      results.push({
        pageNumber: page.pageNumber,
        textSnippet: snippet,
      });
    }
  });

  return results;
}
