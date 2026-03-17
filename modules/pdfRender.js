const fs = require('fs');
const pdf = require('pdf-parse');
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function renderPDF(filePath) {
  const dataBuffer = fs.readFileSync(filePath);

  // ===== TEXT (do legendy) =====
  const parsed = await pdf(dataBuffer);

  // rozbijamy tekst na strony (pdf-parse daje całość, więc heurystyka)
  const textPages = parsed.text.split('\f');

  // ===== RENDER OBRAZÓW =====
  const loadingTask = pdfjsLib.getDocument(filePath);
  const pdfDoc = await loadingTask.promise;

  const pages = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);

    const viewport = page.getViewport({ scale: 2 });

    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    await page.render({
      canvasContext: context,
      viewport
    }).promise;

    const imageData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    pages.push({
      width: canvas.width,
      height: canvas.height,
      data: imageData.data,
      text: textPages[i - 1] || ''
    });
  }

  return pages;
}

module.exports = { renderPDF };
