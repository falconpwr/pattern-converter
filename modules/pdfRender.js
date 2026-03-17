const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

async function renderPDF(filePath) {
  const outputDir = path.join(__dirname, '../temp');

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir);
  }

  const outputPrefix = path.join(outputDir, 'page');

  // 🔥 KONWERSJA PDF → PNG
  execSync(`pdftoppm -png -r 150 "${filePath}" "${outputPrefix}"`);

  // znajdź wygenerowane pliki
  const files = fs
    .readdirSync(outputDir)
    .filter(f => f.startsWith('page') && f.endsWith('.png'))
    .sort((a, b) => {
      const numA = parseInt(a.match(/page-(\d+)/)[1]);
      const numB = parseInt(b.match(/page-(\d+)/)[1]);
      return numA - numB;
    });

  const pages = [];

  for (let file of files) {
    const fullPath = path.join(outputDir, file);

    const buffer = fs.readFileSync(fullPath);

    const { createCanvas, loadImage } = require('canvas');

    const img = await loadImage(buffer);

    const canvas = createCanvas(img.width, img.height);
    const ctx = canvas.getContext('2d');

    ctx.drawImage(img, 0, 0);

    const imageData = ctx.getImageData(
      0,
      0,
      canvas.width,
      canvas.height
    );

    pages.push({
      width: canvas.width,
      height: canvas.height,
      data: imageData.data,
      text: '' // tekst zrobimy osobno (opcjonalnie)
    });

    // cleanup pojedynczego pliku
    fs.unlinkSync(fullPath);
  }

  return pages;
}

module.exports = { renderPDF };
