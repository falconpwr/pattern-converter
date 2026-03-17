const fs = require('fs');

async function renderPDF(filePath) {
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs');

  const data = new Uint8Array(fs.readFileSync(filePath));

  const loadingTask = pdfjsLib.getDocument({
    data,
    useWorkerFetch: false,
    isEvalSupported: false,
    disableFontFace: true,
    disableRange: true,
    disableStream: true
  });

  const pdfDoc = await loadingTask.promise;

  const pages = [];

  for (let i = 1; i <= pdfDoc.numPages; i++) {
    const page = await pdfDoc.getPage(i);

    const viewport = page.getViewport({ scale: 2 });

    // ❗ FAKE canvas (bez drawImage)
    const width = Math.floor(viewport.width);
    const height = Math.floor(viewport.height);

    // pusty buffer (biały)
    const dataArr = new Uint8ClampedArray(width * height * 4);

    for (let j = 0; j < dataArr.length; j += 4) {
      dataArr[j] = 255;
      dataArr[j + 1] = 255;
      dataArr[j + 2] = 255;
      dataArr[j + 3] = 255;
    }

    // 🔥 tekst działa normalnie
    const textContent = await page.getTextContent();
    const text = textContent.items.map(i => i.str).join(' ');

    pages.push({
      width,
      height,
      data: dataArr,
      text
    });
  }

  return pages;
}

module.exports = { renderPDF };
