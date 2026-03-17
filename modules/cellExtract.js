const sharp = require("sharp")

module.exports = async function(image, grid){

if(!grid || !grid.cell || grid.cell < 8){
throw new Error("Invalid grid cell size")
}

const cells = []

for(let y=0;y<grid.rows;y++){

const row=[]

for(let x=0;x<grid.cols;x++){

const buf = await sharp(image)
.extract({
left: x * grid.cell,
top: y * grid.cell,
width: grid.cell,
height: grid.cell
})
.resize(16,16)
.raw()
.toBuffer()

row.push(buf)

}

cells.push(row)

}

return cells

}
