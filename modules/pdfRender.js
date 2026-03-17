const fs = require('fs');
const { createCanvas, Image } = require('canvas');

async function renderPDF(filePath) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const data = new Uint8Array(fs.readFileSync(filePath));

  const loadingTask = pdfjsLib.getDocument({ data });
  const pdfDoc = await loadingTask.promise;

  // 🔥 CanvasFactory (tylko do render)
  const CanvasFactory = {
    create: (width, height) => {
      const canvas = createCanvas(width, height);
      const context = canvas.getContext('2d');
      return { canvas, context };
    },
    reset: (canvasAndContext, width, height) => {
      canvasAndContext.canvas.width = width;
      canvasAndContext.canvas.height = height;
    },
    destroy: (canvasAndContext) => {
      canvasAndContext.canvas = null;
      canvasAndContext.context = null;
    }
  };

  // 🔥 Image patch (KLUCZ DO drawImage crasha)
  pdfjsLib.GlobalWorkerOptions.workerSrc = null;

  const pages = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);

    const viewport = page.getViewport({ scale: 2 });

    const { canvas, context } = CanvasFactory.create(
      viewport.width,
      viewport.height
    );

    await page.render({
      canvasContext: context,
      viewport,
      canvasFactory: CanvasFactory
    }).promise;

    const imageData = context.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    const textContent = await page.getTextContent();

    const text = textContent.items.map(i => i.str).join(' ');

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
