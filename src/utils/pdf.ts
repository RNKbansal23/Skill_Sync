import pdfParse from "pdf-parse";

/**
 * Extracts text from a PDF buffer.
 * @param pdfBuffer Buffer of the PDF file.
 * @returns The extracted text as a string.
 */
export async function getPdfText(pdfBuffer: Buffer): Promise<string> {
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Failed to extract PDF text:", error);
    throw new Error("Failed to extract PDF text");
  }
}
