function parseLegend(text) {
  const lines = text.split('\n');
  const result = [];

  for (let line of lines) {
    line = line.trim();

    const match = line.match(/^(\d+).*?(\d{2,6})\s+\d+$/);

    if (match) {
      result.push({
        dmc: parseInt(match[1], 10),
        count: parseInt(match[2], 10)
      });
    }
  }

  return result;
}

module.exports = { parseLegend };
