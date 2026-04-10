import * as pdfjsLib from 'pdfjs-dist';

// Use a stable CDN for the worker to avoid complex bundler configurations for Vite
pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;

export interface ExtractedRate {
  code: string;
  against: string;
  buy: string;
  sell: string;
}

export async function parseTreasuryPdf(file: File): Promise<ExtractedRate[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const typedarray = new Uint8Array(e.target?.result as ArrayBuffer);
        const pdf = await pdfjsLib.getDocument({ data: typedarray }).promise;
        let fullText = "";

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          
          // PDF.js extracts text in fragments. We join them line by line or with spaces.
          // By joining everything with a space, we can easily run sequence extraction.
          const strings = content.items.map((item: any) => item.str.trim()).filter(Boolean);
          fullText += strings.join(" ") + " \n";
        }

        // Regex looks for "CODE / AGAINST BUY MID SELL"
        // e.g. "USD / ZWG 24.4829 25.2401 25.9973"
        // Groups: 1 = CODE, 2 = AGAINST, 3 = BUY, 4 = SELL (we skip mid which is the sequence `[\d.,]+` in middle)
        const regex = /([A-Z]{3})\s*\/\s*([A-Z]{3})\s+([\d.,]+)\s+[\d.,]+\s+([\d.,]+)/g;
        
        const extracted: ExtractedRate[] = [];
        let match;
        
        while ((match = regex.exec(fullText)) !== null) {
          const code = match[1].toUpperCase();
          const against = match[2].toUpperCase();
          const buy = match[3];
          const sell = match[4];

          // User explicitly requested to ONLY extract rates against USD, ZWG, and ZAR
          if (["USD", "ZWG", "ZAR"].includes(against)) {
            extracted.push({ code, against, buy, sell });
          }
        }

        resolve(extracted);
      } catch (err) {
        console.error("PDF Parsing error:", err);
        reject(err);
      }
    };
    reader.onerror = (err) => reject(err);
    reader.readAsArrayBuffer(file);
  });
}
