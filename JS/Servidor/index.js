import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { cardapio } from "./routes/cardapio.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.use("/cardapio", cardapio);

app.listen(PORT, () => {
  console.log(`Aplicação aberta na porta ${PORT}`);
});
