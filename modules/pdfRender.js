const sharp = require("sharp")
const fs = require("fs")

module.exports = async function(pdfPath){

const output = "uploads/page-1.png"

await sharp(pdfPath, { density: 300 })
.png()
.toFile(output)

console.log("PDF rendered to image:", output)

return [output]

}
