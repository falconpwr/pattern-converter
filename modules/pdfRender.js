const fs = require('fs');
const { createCanvas } = require('canvas');
const pdfjsLib = require('pdfjs-dist/legacy/build/pdf.js');

async function renderPDF(filePath) {
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

    // ===== TEXT (LEGENDA) =====
    const textContent = await page.getTextContent();

    const text = textContent.items
      .map(item => item.str)
      .join(' ');

    pages.push({
      width: canvas.width,
      height: canvas.height,
      data: imageData.data,
      text
    });
  }

  return pages;
}

module.exports = { renderPDF };
