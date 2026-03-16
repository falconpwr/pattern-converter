const sharp = require("sharp")

module.exports = async function(image){

const img = sharp(image)

const {data, info} = await img
.grayscale()
.raw()
.toBuffer({ resolveWithObject:true })

const width = info.width
const height = info.height

const vertical = new Array(width).fill(0)
const horizontal = new Array(height).fill(0)

for(let y=0;y<height;y++){

for(let x=0;x<width;x++){

const v = data[y*width+x]

if(v < 50){

vertical[x]++
horizontal[y]++

}

}

}

function findSpacing(arr){

const peaks=[]

for(let i=1;i<arr.length-1;i++){

if(arr[i] > arr[i-1] && arr[i] > arr[i+1] && arr[i] > 20){
peaks.push(i)
}

}

if(peaks.length < 2) return null

const distances=[]

for(let i=1;i<peaks.length;i++){
distances.push(peaks[i]-peaks[i-1])
}

distances.sort((a,b)=>a-b)

return distances[Math.floor(distances.length/2)]

}

const cellX = findSpacing(vertical)
const cellY = findSpacing(horizontal)

const cell = Math.round((cellX + cellY)/2)

const cols = Math.floor(width / cell)
const rows = Math.floor(height / cell)

return {
cell,
cols,
rows
}

}
