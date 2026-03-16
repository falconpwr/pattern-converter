const socket=io()

socket.on("progress",data=>{

const percent=Math.floor((data.processed/data.total)*100)

document.getElementById("bar").style.width=percent+"%"

document.getElementById("stats").innerText=
data.processed+" / "+data.total+" cells"

})

async function upload(){

const file = document.getElementById("file").files[0]
const format = document.getElementById("format").value

if(file.type === "application/pdf"){

const pdfjsLib = window["pdfjsLib"]

const data = await file.arrayBuffer()
const pdf = await pdfjsLib.getDocument({data}).promise

const page = await pdf.getPage(1)
const viewport = page.getViewport({scale:3})

const canvas = document.createElement("canvas")
const ctx = canvas.getContext("2d")

canvas.width = viewport.width
canvas.height = viewport.height

await page.render({
canvasContext: ctx,
viewport
}).promise

const blob = await new Promise(r => canvas.toBlob(r))

const form = new FormData()
form.append("file", blob, "page.png")
form.append("format", format)
form.append("socketId", socket.id)

const res = await fetch("/convert",{
method:"POST",
body:form
})

const result = await res.blob()

const url = URL.createObjectURL(result)

const a = document.createElement("a")
a.href = url
a.download = "pattern.pdf"
a.click()

}

}
