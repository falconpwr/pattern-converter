const socket = io()

let socketId = null

socket.on("connect", () => {
  socketId = socket.id
  console.log("Socket connected:", socketId)
})

socket.on("progress", data => {

  const percent = Math.floor((data.processed / data.total) * 100)

  document.getElementById("bar").style.width = percent + "%"

  document.getElementById("stats").innerText =
    data.processed + " / " + data.total + " cells"
})

async function upload() {
  
  const fromPage = document.getElementById("fromPage").value
  const toPage = document.getElementById("toPage").value

  try {

    const file = document.getElementById("file").files[0]
    const format = document.getElementById("format").value

    if (!file) {
      alert("Wybierz plik")
      return
    }

    if (!socketId) {
      alert("Serwer się łączy — spróbuj za chwilę")
      return
    }

    // 🔥 tylko PDF
    if (file.type !== "application/pdf") {
      alert("Obsługiwany jest tylko PDF")
      return
    }

    const pdfjsLib = window.pdfjsLib

    const data = await file.arrayBuffer()
    const pdf = await pdfjsLib.getDocument({ data }).promise

    const page = await pdf.getPage(1)
    const viewport = page.getViewport({ scale: 3 })

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    canvas.width = viewport.width
    canvas.height = viewport.height

    await page.render({
      canvasContext: ctx,
      viewport
    }).promise

    const blob = await new Promise(resolve => canvas.toBlob(resolve))

    const form = new FormData()
    form.append("fromPage", fromPage)
    form.append("toPage", toPage)
    form.append("file", blob, "page.png")
    form.append("format", format)
    form.append("socketId", socketId)

    const res = await fetch("/convert", {
      method: "POST",
      body: form
    })

    // 🔥 KLUCZOWE: obsługa błędu backendu
    if (!res.ok) {
      const text = await res.text()
      console.error("Server error:", text)
      alert("Błąd konwersji (sprawdź konsolę)")
      return
    }

    const result = await res.blob()

    if (result.size < 1000) {
      alert("Plik jest podejrzanie mały — coś poszło nie tak")
      return
    }

    const url = URL.createObjectURL(result)

    const a = document.createElement("a")
    a.href = url
    a.download = "pattern.pdf"
    a.click()

  } catch (err) {

    console.error("Upload error:", err)
    alert("Błąd aplikacji — sprawdź konsolę")

  }
}
