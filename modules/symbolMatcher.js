function matchSymbolsToLegend(symbolCounts, legend) {
  const result = {};
  const used = new Set();

  const entries = Object.entries(symbolCounts);

  entries.sort((a, b) => b[1] - a[1]);
  legend.sort((a, b) => b.count - a.count);

  for (let [symbolId, count] of entries) {
    let best = null;
    let bestIndex = -1;
    let bestDiff = Infinity;

    for (let i = 0; i < legend.length; i++) {
      if (used.has(i)) continue;

      const diff = Math.abs(count - legend[i].count);

      if (diff < bestDiff) {
        bestDiff = diff;
        best = legend[i];
        bestIndex = i;
      }
    }

    if (best) {
      result[symbolId] = best.dmc;
      used.add(bestIndex);
    }
  }

  return result;
}

module.exports = { matchSymbolsToLegend };
