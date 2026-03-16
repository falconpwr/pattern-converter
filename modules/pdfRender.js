const fs = require("fs")
const pdfjs = require("pdfjs-dist")

module.exports = async function(pdfPath){

const data = new Uint8Array(fs.readFileSync(pdfPath))

const loadingTask = pdfjs.getDocument({data})
const pdf = await loadingTask.promise

const pages = []

for(let i=1;i<=pdf.numPages;i++){

const page = await pdf.getPage(i)

const viewport = page.getViewport({scale:2})

const canvasFactory = {
create: function(width, height) {
const data = new Uint8ClampedArray(width * height * 4)
return {canvas:{width,height,data},context:{data}}
},
reset(){},
destroy(){}
}

const renderContext = {
canvasContext: canvasFactory.create(viewport.width,viewport.height),
viewport
}

await page.render(renderContext).promise

const output = `uploads/page-${i}.raw`

fs.writeFileSync(output, renderContext.canvasContext.data)

pages.push(output)

}

console.log("PDF pages:", pages)

return pages

}
