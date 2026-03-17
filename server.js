const express = require('express');
const multer = require('multer');
const http = require('http');
const socketIo = require('socket.io');

const { renderPDF } = require('./modules/pdfRender');
const { detectGrid } = require('./modules/gridDetect');
const { extractCells } = require('./modules/cellExtract');
const { buildSymbolMap } = require('./modules/symbolHash');
const { parseLegend } = require('./modules/legendParser');
const { matchSymbolsToLegend } = require('./modules/symbolMatcher');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const upload = multer({ dest: 'uploads/' });

app.use(express.static('public'));

app.post('/upload', upload.single('file'), async (req, res) => {
  const filePath = req.file.path;

  const fromPage = parseInt(req.body.fromPage);
  const toPage = parseInt(req.body.toPage);

  const legendFrom = parseInt(req.body.legendFrom);
  const legendTo = parseInt(req.body.legendTo);

  // render wszystkich potrzebnych stron
  const pages = await renderPDF(filePath);

  // ===== WZÓR =====
let allCells = [];

for (let i = fromPage - 1; i < toPage; i++) {
  const page = pages[i];

  const gridData = detectGrid(page);

  if (!gridData.cell || isNaN(gridData.cell)) {
    console.log('Skipping page - bad grid');
    continue;
  }

  const cells = extractCells(
    page.data,
    page.width,
    page.height,
    gridData
  );

  // 🔥 KLUCZ: zapisujemy też cell per page
  for (let cell of cells) {
    allCells.push({
      data: cell,
      cellSize: gridData.cell
    });
  }
}

  io.emit('progress', 40);

  // ===== SYMBOLE =====
  const { grid, counts } = buildSymbolMap(allCells, gridData.cell);

  io.emit('progress', 70);

  // ===== LEGENDA =====
  let legendText = '';

  for (let i = legendFrom - 1; i < legendTo; i++) {
    if (pages[i].text) {
      legendText += pages[i].text + '\n';
    }
  }

  const legend = parseLegend(legendText);

  io.emit('progress', 85);

  // ===== MATCH =====
  const symbolToDMC = matchSymbolsToLegend(counts, legend);

  console.log('DOPASOWANIE:', symbolToDMC);

  io.emit('progress', 100);

  res.send('DONE');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
