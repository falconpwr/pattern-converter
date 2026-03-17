module.exports = async function(cells, progress){

  if(!cells || cells.length === 0 || !cells[0]){
    throw new Error("Invalid cells input")
  }

  const map = new Map()
  let id = 0

  const rows = cells.length
  const cols = cells[0].length

  const result = []

  const SYMBOLS = generateSymbols(400)

  for(let y = 0; y < rows; y++){

    const row = []

    for(let x = 0; x < cols; x++){

      const cell = cells[y][x]

      if(!cell){
        row.push("?")
        continue
      }

      let hash = ""

      const len = Math.min(20, cell.length)

      for(let i = 0; i < len; i++){
        hash += cell[i] + "-"
      }

      if(!map.has(hash)){
        map.set(hash, SYMBOLS[id] || "?")
        id++
      }

      row.push(map.get(hash))
    }

    result.push(row)

    if(progress){
      progress(cols)
    }
  }

  console.log("SYMBOLS:", map.size)

  return result
}


function generateSymbols(n){

  const symbols = []

  // ASCII
  for(let i = 33; i <= 126; i++){
    symbols.push(String.fromCharCode(i))
  }

  // fallback (bez limitu)
  for(let i = 0; i < n; i++){
    symbols.push("§" + i)
  }

  return symbols
}
