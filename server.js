const express=require("express")
const multer=require("multer")
const http=require("http")
const {Server}=require("socket.io")

const renderPDF=require("./modules/pdfRender")
const detectGrid=require("./modules/gridDetect")
const extractCells=require("./modules/cellExtract")
const hashSymbols=require("./modules/symbolHash")
const buildPDF=require("./modules/pdfBuilder")
const buildXSD=require("./modules/xsdBuilder")

const upload=multer({dest:"uploads/"})

const app=express()
const server=http.createServer(app)
const io=new Server(server)

app.use(express.static("public"))

app.post("/convert",upload.single("file"),async(req,res)=>{

const socket=io.sockets.sockets.get(req.body.socketId)
const format=req.body.format

const pages = await renderPDF(req.file.path)

if(!pages || pages.length === 0){
throw new Error("PDF pages not detected")
}

let processed=0
let total=0

const result=[]

for(const page of pages){

const grid=await detectGrid(page)

const cells=await extractCells(page,grid)

total+=cells.length*cells[0].length

const matrix=await hashSymbols(cells,(n)=>{

processed+=n

if(socket){
socket.emit("progress",{processed,total})
}

})

result.push(matrix)

}

let file

if(format==="xsd")
file=await buildXSD(result)
else
file=await buildPDF(result)

res.download(file)

})

server.listen(process.env.PORT||3000,()=>{
console.log("Server started")
})
