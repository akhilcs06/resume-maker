// Add a declaration file for the react-to-pdf module
declare module 'react-to-pdf' {
    interface PDFOptions {
        filename?: string;
        page?: {
            margin?: number;
            format?: string;
            orientation?: 'portrait' | 'landscape';
        };
        canvas?: {
            mimeType?: string;
            qualityRatio?: number;
        };
        overrides?: {
            pdf?: {
                compress?: boolean;
            };
            canvas?: {
                useCORS?: boolean;
            };
        };
        method?: 'save' | 'open';
    }
    // Default export is the generatePDF function
    export default function generatePDF(
        target: React.RefObject<HTMLElement | null> | (() => HTMLElement | null) | HTMLElement | null,
        options?: PDFOptions
    ): Promise<void>;

    export function usePDF(options?: PDFOptions): {
        toPDF: () => Promise<void>;
        targetRef: React.RefObject<HTMLDivElement>;
    };
}
