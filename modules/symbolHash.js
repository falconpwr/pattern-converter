module.exports = async function(cells, progress){

  const SYMBOLS = [
    "A","B","C","D","E","F","G","H","I","J",
    "K","L","M","N","O","P","Q","R","S","T",
    "U","V","W","X","Y","Z",
    "a","b","c","d","e","f","g","h","i","j",
    "k","l","m","n","o","p","q","r","s","t",
    "u","v","w","x","y","z",
    "1","2","3","4","5","6","7","8","9",
    "!","@","#","$","%","&","*","+","=","?"
  ]

  const map = new Map()
  let id = 0

  const rows = cells.length
  const cols = cells[0].length

  const result = []

  for(let y=0;y<rows;y++){

    const row=[]

    for(let x=0;x<cols;x++){

      const cell = cells[y][x]

      // 🔥 średni kolor
      let r=0,g=0,b=0

      for(let i=0;i<cell.length;i+=4){
        r+=cell[i]
        g+=cell[i+1]
        b+=cell[i+2]
      }

      const count = cell.length/4

      r = Math.round(r/count)
      g = Math.round(g/count)
      b = Math.round(b/count)

      // 🔥 REDUKCJA KOLORÓW
      const STEP = 32
      
      r = Math.round(r / STEP) * STEP
      g = Math.round(g / STEP) * STEP
      b = Math.round(b / STEP) * STEP
      
      const hash = `${r}-${g}-${b}`

      if(!map.has(hash)){

        if(id >= SYMBOLS.length){
          throw new Error("Za dużo kolorów (limit symboli)")
        }

        map.set(hash, SYMBOLS[id])
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
