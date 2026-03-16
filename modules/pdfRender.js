const { fromPath } = require("pdf2pic")
const fs = require("fs")

module.exports = async function(pdf) {

const convert = fromPath(pdf, {
density: 150,
saveFilename: "page",
savePath: "uploads",
format: "png",
width: 1200,
height: 1600
})

const pages = []

for(let i=1;i<=20;i++){

try{

const res = await convert(i)

if(res && res.path){
pages.push(res.path)
}

}catch(e){
break
}

}

return pages

}
