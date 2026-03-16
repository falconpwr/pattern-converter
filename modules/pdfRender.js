const fs = require("fs")
const path = require("path")
const pdfjsLib = require("pdfjs-dist/legacy/build/pdf.js")
const { createCanvas } = require("canvas")

module.exports = async function(pdfPath){

const data = new Uint8Array(fs.readFileSync(pdfPath))

const pdf = await pdfjsLib.getDocument({data}).promise

const pages = []

for(let i=1;i<=pdf.numPages;i++){

const page = await pdf.getPage(i)

const viewport = page.getViewport({ scale:2 })

const canvas = createCanvas(viewport.width, viewport.height)
const context = canvas.getContext("2d")

await page.render({
canvasContext: context,
viewport
}).promise

const output = `uploads/page-${i}.png`

fs.writeFileSync(output, canvas.toBuffer("image/png"))

pages.push(output)

}

console.log("PDF rendered pages:", pages)

return pages

}
