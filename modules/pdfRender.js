const { fromPath } = require("pdf2pic")

module.exports = async function(pdfPath){

const convert = fromPath(pdfPath, {
density: 300,
saveFilename: "page",
savePath: "uploads",
format: "png",
width: 2000,
height: 2000
})

const pages = []

for(let i=1;i<=10;i++){

try{

const res = await convert(i)

if(res && res.path){
pages.push(res.path)
}

}catch(e){
break
}

}

console.log("Rendered pages:", pages)

return pages

}
