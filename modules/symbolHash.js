module.exports = async function(cells, progress){

const map = new Map()
let id = 0

const rows = cells.length
const cols = cells[0].length

const result = []

for(let y=0;y<rows;y++){

const row=[]

for(let x=0;x<cols;x++){

const cell = cells[y][x]

// 🔥 szybki hash (pierwsze 20 bajtów)
let hash = ""

for(let i=0;i<20;i++){
hash += cell[i]
}

if(!map.has(hash)){
map.set(hash, String.fromCharCode(33 + id))
id++
}

row.push(map.get(hash))

}

result.push(row)

// 🔥 progress co wiersz (zamiast każdej kratki)
if(progress){
progress(cols)
}

}

console.log("SYMBOLS:", map.size)

return result

}
