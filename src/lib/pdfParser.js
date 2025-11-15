import { PdfReader } from "pdfreader";

export function extractTextFromPDF(buffer) {
  return new Promise((resolve, reject) => {
    const items = [];
    new PdfReader().parseBuffer(buffer, (err, item) => {
      if (err) return reject(err);
      if (!item) return resolve(items.join(" "));
      if (item.text) items.push(item.text);
    });
  });
}