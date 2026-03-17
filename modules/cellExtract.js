if(!grid.cell || grid.cell < 8){
throw new Error("Invalid grid cell size")
}

console.log("FINAL CELL:", cell)

const sharp=require("sharp")

module.exports=async function(image){

const meta=await sharp(image).metadata()

const cell=20

const cols=Math.floor(meta.width/cell)
const rows=Math.floor(meta.height/cell)

return{
cell,
cols,
rows
}

}
