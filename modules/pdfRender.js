const fs = require("fs")
const path = require("path")
const sharp = require("sharp")
const pdfjsLib = require("pdfjs-dist")

module.exports = async function(pdfPath){

const data = new Uint8Array(fs.readFileSync(pdfPath))

const pdf = await pdfjsLib.getDocument({data}).promise

  
const pages = []

for(let i=1;i<=pdf.numPages;i++){

const page = await pdf.getPage(i)

const viewport = page.getViewport({scale:2})

const canvasFactory = {
create: function(width, height) {
const data = new Uint8ClampedArray(width * height * 4)
return { canvas: { width, height, data }, context: { data } }
},
reset: function(){},
destroy: function(){}
}

const renderContext = {
canvasContext: canvasFactory.create(viewport.width, viewport.height),
viewport
}

await page.render(renderContext).promise

const img = await sharp(Buffer.from(renderContext.canvasContext.data))
.png()
.toFile(`uploads/page-${i}.png`)

pages.push(`uploads/page-${i}.png`)

}
console.log("Generated images:", pages)
return pages

}
