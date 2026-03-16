const sharp = require("sharp")
const fs = require("fs")

module.exports = async function(pdfPath){

const output = "uploads/page-1.png"

try{

await sharp(pdfPath, {
density: 300,
page: 0
})
.png()
.toFile(output)

console.log("PDF rendered:", output)

return [output]

}catch(err){

console.error("PDF render error:", err)

return []

}

}
