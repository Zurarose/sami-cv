import { PDFDict, PDFDocument, PDFName } from 'pdf-lib';
import pdf from 'pdf-parse';

/**
 * Figma exports draw text with Type3 fonts that carry neither /BaseFont nor a
 * /FontName in their descriptor. pdf.js rejects such fonts ("invalid font
 * name") and returns empty strings for every glyph, even though the /ToUnicode
 * maps are intact. Giving each font a name restores the mapping.
 *
 * Returns null when there is nothing to name.
 */
async function nameAnonymousFonts(buffer: Buffer): Promise<Buffer | null> {
  const document = await PDFDocument.load(buffer, {
    throwOnInvalidObject: false,
    updateMetadata: false,
  });

  let named = 0;

  for (const [, object] of document.context.enumerateIndirectObjects()) {
    if (!(object instanceof PDFDict)) continue;
    if (object.get(PDFName.of('Type'))?.toString() !== '/Font') continue;
    if (object.get(PDFName.of('BaseFont')) || object.get(PDFName.of('Name'))) {
      continue;
    }

    const fontName = `EmbeddedFont${named + 1}`;
    object.set(PDFName.of('Name'), PDFName.of(fontName));

    const descriptor = document.context.lookup(
      object.get(PDFName.of('FontDescriptor'))
    );
    if (descriptor instanceof PDFDict) {
      descriptor.set(PDFName.of('FontName'), PDFName.of(fontName));
    }

    named += 1;
  }

  if (named === 0) return null;

  return Buffer.from(await document.save());
}

/**
 * Reads the text layer of a PDF, repairing anonymous embedded fonts when the
 * first attempt yields nothing.
 */
export async function extractPdfText(buffer: Buffer): Promise<string> {
  const text = (await pdf(buffer)).text;
  if (text.trim()) return text;

  try {
    const repaired = await nameAnonymousFonts(buffer);
    if (!repaired) return text;

    const repairedText = (await pdf(repaired)).text;
    return repairedText.trim() ? repairedText : text;
  } catch (error) {
    console.error('Failed to repair PDF fonts', error);
    return text;
  }
}
