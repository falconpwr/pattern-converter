const BASE=[
"●","○","▲","△","■","□","◆","◇","★","☆",
"✕","✖","✚","✛","✜","☀","☁","☂","☃","☼",
"♠","♣","♥","♦","⬟","⬢","⬣","⬤","⬥",
"✢","✣","✤","✥","✦","✧","✩","✪","✫","✬"
]

function generate(){

const symbols=[]

for(const b of BASE){

symbols.push(b)
symbols.push(b+"•")
symbols.push(b+"_")

}

return symbols

}

module.exports=generate
