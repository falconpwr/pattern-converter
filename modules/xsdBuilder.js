const fs=require("fs")

module.exports=async function(pages){

let xml='<?xml version="1.0"?>\n'
xml+="<Pattern>\n"

for(const grid of pages){

for(const row of grid){

xml+="<Row>"+row.join("")+"</Row>\n"

}

}

xml+="</Pattern>"

fs.writeFileSync("pattern.xsd",xml)

return "pattern.xsd"

}
