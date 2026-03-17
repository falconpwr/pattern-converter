function toGray(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function getSignature(cell, cellSize) {
  const size = 16;
  const step = Math.floor(cellSize / size);

  let bits = [];

  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const px = (y * step * cellSize + x * step) * 4;

      const g = toGray(cell[px], cell[px+1], cell[px+2]);

      bits.push(g < 200 ? 1 : 0);
    }
  }

  return bits.join('');
}

function hamming(a, b) {
  let d = 0;
  for (let i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) d++;
  }
  return d;
}

function buildSymbolMap(cells) {
  const symbols = [];
  const grid = [];
  const counts = {};

  for (let cell of cells) {
    const sig = getSignature(cell, cellSize);

    let found = null;

    for (let s of symbols) {
      if (hamming(sig, s.sig) < 30) {
        found = s;
        break;
      }
    }

    if (!found) {
      found = { id: symbols.length, sig };
      symbols.push(found);
    }

    grid.push(found.id);
    counts[found.id] = (counts[found.id] || 0) + 1;
  }

  return { grid, counts };
}

module.exports = { buildSymbolMap };
