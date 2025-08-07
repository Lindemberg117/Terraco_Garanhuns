import { Router } from "express";

import {
  obterCardapio,
  cadastrarItem,
  atualizarItem,
  removerItem,
} from "../controllers/cardapioControllers.js";

const cardapio = Router();

cardapio.get("/", obterCardapio);

cardapio.post("/", cadastrarItem);

cardapio.put("/:id", atualizarItem);

cardapio.delete("/:id", removerItem);

export { cardapio };
