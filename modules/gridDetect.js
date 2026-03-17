function toGray(r, g, b) {
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function detectGrid(page) {
  const { data, width, height } = page;

  const vertical = new Array(width).fill(0);

  for (let x = 0; x < width; x++) {
    let sum = 0;

    for (let y = 0; y < height; y++) {
      const i = (y * width + x) * 4;
      const g = toGray(data[i], data[i+1], data[i+2]);
      sum += g;
    }

    vertical[x] = sum / height;
  }

  const horizontal = new Array(height).fill(0);

  for (let y = 0; y < height; y++) {
    let sum = 0;

    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const g = toGray(data[i], data[i+1], data[i+2]);
      sum += g;
    }

    horizontal[y] = sum / width;
  }

  function findLines(arr) {
    const lines = [];

    for (let i = 1; i < arr.length - 1; i++) {
      if (arr[i] < arr[i-1] - 5 && arr[i] < arr[i+1] - 5) {
        lines.push(i);
      }
    }

    return lines;
  }

  const vLines = findLines(vertical);
  const hLines = findLines(horizontal);

  function avgSpacing(lines) {
    const diffs = [];

    for (let i = 1; i < lines.length; i++) {
      diffs.push(lines[i] - lines[i - 1]);
    }

    const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;

    return Math.round(avg);
  }

  const cell = avgSpacing(vLines);

  const cols = Math.floor(width / cell);
  const rows = Math.floor(height / cell);

  console.log('GRID:', { cell, cols, rows });

  return { cell, cols, rows };
}

module.exports = { detectGrid };
