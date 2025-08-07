import { Router } from "express";
import { dbPromise } from "../database/db.js";

const cardapio = Router();

// GET /cardapio
cardapio.get("/", obterCardapio);

// POST /cardapio
cardapio.post("/", cadastrarItem);

// PUT /cardapio/:id
cardapio.put("/:id", atualizarItem);

// DELETE /cardapio/:id
cardapio.delete("/:id", removerItem);

// Funções

async function obterCardapio(req, res) {
    const db = await dbPromise;
    const itens = await db.all("SELECT * FROM cardapio");
    return res.status(200).json(itens);
}

async function cadastrarItem(req, res) {
    const { nome, descricao, preco, img } = req.body;

    if (!nome || !descricao || !preco || !img) {
        return res.status(400).json({ mensagem: "Todos os campos são obrigatórios" });
    }

    const db = await dbPromise;
    await db.run(
        "INSERT INTO cardapio (nome, descricao, preco, img) VALUES (?, ?, ?, ?)",
        [nome, descricao, preco, img]
    );

    return res.status(201).json({ nome, descricao, preco, img });
}

async function atualizarItem(req, res) {
    const id = req.params.id;
    const { nome, descricao, preco, img } = req.body;

    const db = await dbPromise;
    const item = await db.get("SELECT * FROM cardapio WHERE id = ?", [id]);

    if (!item) {
        return res.status(404).json({ mensagem: "Item não encontrado" });
    }

    await db.run(
        "UPDATE cardapio SET nome = ?, descricao = ?, preco = ?, img = ? WHERE id = ?",
        [nome || item.nome, descricao || item.descricao, preco || item.preco, img || item.img, id]
    );

    return res.status(200).json({ nome, descricao, preco, img });
}

async function removerItem(req, res) {
    const id = req.params.id;

    const db = await dbPromise;
    const item = await db.get("SELECT * FROM cardapio WHERE id = ?", [id]);

    if (!item) {
        return res.status(404).json({ mensagem: "Item não encontrado" });
    }

    await db.run("DELETE FROM cardapio WHERE id = ?", [id]);
    return res.status(204).send();
}

export { cardapio };
