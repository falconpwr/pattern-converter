function extractCells(imageData, width, height, grid) {
  const { cell, cols, rows } = grid;

  const cells = [];
  const margin = Math.floor(cell * 0.25);

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {

      const pixels = [];

      for (let y = margin; y < cell - margin; y++) {
        for (let x = margin; x < cell - margin; x++) {

          const px = ((r * cell + y) * width + (c * cell + x)) * 4;

          pixels.push(
            imageData[px],
            imageData[px+1],
            imageData[px+2],
            imageData[px+3]
          );
        }
      }

      cells.push(pixels);
    }
  }

  return cells;
}

module.exports = { extractCells };
