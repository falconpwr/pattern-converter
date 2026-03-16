const socket=io()

socket.on("progress",data=>{

const percent=Math.floor((data.processed/data.total)*100)

document.getElementById("bar").style.width=percent+"%"

document.getElementById("stats").innerText=
data.processed+" / "+data.total+" cells"

})

async function upload(){

const file=document.getElementById("file").files[0]
const format=document.getElementById("format").value

const form=new FormData()

form.append("file",file)
form.append("format",format)
form.append("socketId",socket.id)

const res=await fetch("/convert",{
method:"POST",
body:form
})

const blob=await res.blob()

const url=URL.createObjectURL(blob)

const a=document.createElement("a")

a.href=url
a.download=format==="xsd"?"pattern.xsd":"pattern.pdf"

a.click()

}
