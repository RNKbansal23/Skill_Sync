import pdfParse from 'pdf-parse';

export async function getPdfText(pdfBuffer: Buffer): Promise<string> {
  console.log('hello');
  console.log(pdfBuffer);
  try {
    const data = await pdfParse(pdfBuffer);
    return data.text;
  } catch (error) {
    console.error("Failed to extract PDF text:", error);
    throw new Error("Failed to extract PDF text");
  }
}
