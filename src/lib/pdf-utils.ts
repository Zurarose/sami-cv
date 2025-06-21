import { PDFDocument, PDFTextField } from 'pdf-lib';

export interface PDFReplacementData {
  [key: string]: string;
}

/**
 * Replaces placeholders in a PDF document with provided values
 * @param pdfBuffer - The PDF file as a buffer or Uint8Array
 * @param replacements - Object containing key-value pairs for replacements
 * @returns Promise<Uint8Array> - The modified PDF as bytes
 */
export async function replacePDFPlaceholders(
  pdfBuffer: ArrayBuffer | Uint8Array,
  replacements: PDFReplacementData
): Promise<Uint8Array> {
  try {
    // Load the PDF document
    const pdfDoc = await PDFDocument.load(pdfBuffer);

    // Get the form (if it exists) for form fields
    const form = pdfDoc.getForm();

    // Method 1: Try to fill form fields that match our placeholders
    if (form) {
      const fields = form.getFields();

      for (const field of fields) {
        const fieldName = field.getName();

        // Check if field name matches any of our replacement keys
        // Handle both {{key}} format and direct key format
        const cleanFieldName = fieldName.replace(/[{}]/g, '');

        if (replacements[cleanFieldName] && field instanceof PDFTextField) {
          field.setText(replacements[cleanFieldName]);
        }

        // Also check for exact matches with brackets
        if (replacements[fieldName] && field instanceof PDFTextField) {
          field.setText(replacements[fieldName]);
        }
      }
    }

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error processing PDF:', error);
    throw new Error(
      `Failed to process PDF: ${error instanceof Error ? error.message : 'Unknown error'}`
    );
  }
}
