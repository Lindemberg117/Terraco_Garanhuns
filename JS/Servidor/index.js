import express from "express"

const app = express();
app.use(express.static("public"))


app.listen(8080,ola)
function ola(){
    console.log("Aplicação aberta na porta 8080")
}
