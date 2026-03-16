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
