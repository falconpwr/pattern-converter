module.exports = async function (cells, progress) {

  const map = new Map()
  let id = 0

  const rows = cells.length
  const cols = cells[0].length

  const result = []

  for (let y = 0; y < rows; y++) {

    const row = []

    for (let x = 0; x < cols; x++) {

      const cell = cells[y][x]

      // 🔥 bierzemy ŚREDNI kolor zamiast raw hash
      let r = 0, g = 0, b = 0
      const pixels = cell.length / 4

      for (let i = 0; i < cell.length; i += 4) {
        r += cell[i]
        g += cell[i + 1]
        b += cell[i + 2]
      }

      r = Math.round(r / pixels)
      g = Math.round(g / pixels)
      b = Math.round(b / pixels)

      // 🔥 KWANTYZACJA (KLUCZ)
      const step = 32   // możesz zmienić na 16 dla większej dokładności

      r = Math.round(r / step) * step
      g = Math.round(g / step) * step
      b = Math.round(b / step) * step

      const hash = `${r},${g},${b}`

      if (!map.has(hash)) {
        map.set(hash, String.fromCharCode(33 + id))
        id++
      }

      row.push(map.get(hash))
    }

    result.push(row)

    if (progress) progress(cols)
  }

  console.log("SYMBOLS:", map.size)

  return result
}
