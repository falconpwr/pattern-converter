const poppler=require("pdf-poppler")
const fs=require("fs")

module.exports=async function(pdf){

const opts={
format:"png",
out_dir:"uploads",
out_prefix:"page"
}

await poppler.convert(pdf,opts)

const pages=[]

for(let i=1;i<200;i++){

const file=`uploads/page-${i}.png`

if(fs.existsSync(file))
pages.push(file)

}

return pages

}
