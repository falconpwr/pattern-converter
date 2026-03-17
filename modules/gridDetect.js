const sharp = require("sharp")

module.exports = async function(image){

const {data, info} = await sharp(image)
.grayscale()
.raw()
.toBuffer({ resolveWithObject:true })

const width = info.width
const height = info.height

// szukamy powtarzalności w poziomie
function detectCellSize(){

const scores = []

for(let size=10; size<=40; size++){

let diff = 0
let count = 0

for(let y=0;y<height;y+=size){

for(let x=0;x<width-size;x++){

const a = data[y*width + x]
const b = data[y*width + x + size]

diff += Math.abs(a-b)
count++

}

}

scores.push({
size,
score: diff / count
})

}

// wybieramy najlepszy match (najmniejsza różnica)
scores.sort((a,b)=>a.score-b.score)

return scores[0].size

}

const cell = detectCellSize()

const cols = Math.floor(width / cell)
const rows = Math.floor(height / cell)

console.log("Detected grid:", {cell, cols, rows})

return {
cell,
cols,
rows
}

}
