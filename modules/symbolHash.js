const generateSymbols=require("./symbolSet")

const SYMBOLS=generateSymbols()

module.exports=async function(cells,progress){

const dict={}
let index=0

const matrix=[]

for(const row of cells){

const r=[]

for(const c of row){

let sum=0

for(let i=0;i<c.length;i+=8){
sum+=c[i]
}

const hash=sum.toString()

if(!dict[hash]){
dict[hash]=SYMBOLS[index++]
}

r.push(dict[hash])

}

matrix.push(r)

if(progress)progress(100)

}

return matrix

}
