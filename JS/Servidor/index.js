// import express from "express";

// const app = express();
// app.use(express.static("public"));

// app.listen(8080, ola);

// function ola() {
//   console.log("Aplicação aberta na porta 8080");
// }

import express from 'express'
import cors from 'cors'
import { dbPromise } from './database/db.js'

const app = express()
app.use(cors())
app.use(express.json())
app.use(express.static('public'))

// ---------------------- ROTAS ----------------------------

// 🔹 GET: Listar todos os itens
app.get('/cardapio', async (req, res) => {
    const db = await dbPromise
    const itens = await db.all('SELECT * FROM cardapio')
    res.json(itens)
})

// 🔹 GET: Item por ID
app.get('/cardapio/:id', async (req, res) => {
    const db = await dbPromise
    const { id } = req.params
    const item = await db.get('SELECT * FROM cardapio WHERE id = ?', id)

    if (item) res.json(item)
    else res.status(404).json({ erro: 'Item não encontrado' })
})

// 🔹 POST: Criar novo item
app.post('/cardapio', async (req, res) => {
    const db = await dbPromise
    const { nome, descricao, valor, img } = req.body

    if (!nome || !descricao || !valor || !img) {
        return res.status(400).json({ erro: 'Campos obrigatórios ausentes' })
    }

    const result = await db.run(
        `INSERT INTO cardapio (nome, descricao, valor, img) VALUES (?, ?, ?, ?)`,
        [nome, descricao, valor, img]
    )

    const novoItem = await db.get('SELECT * FROM cardapio WHERE id = ?', result.lastID)
    res.status(201).json(novoItem)
})

// 🔹 PUT: Atualizar item
app.put('/cardapio/:id', async (req, res) => {
    const db = await dbPromise
    const { id } = req.params
    const { nome, descricao, valor, img } = req.body

    const item = await db.get('SELECT * FROM cardapio WHERE id = ?', id)
    if (!item) {
        return res.status(404).json({ erro: 'Item não encontrado' })
    }

    await db.run(
        `UPDATE cardapio SET nome = ?, descricao = ?, valor = ?, img = ? WHERE id = ?`,
        [nome || item.nome, descricao || item.descricao, valor || item.valor, img || item.img, id]
    )

    const atualizado = await db.get('SELECT * FROM cardapio WHERE id = ?', id)
    res.json(atualizado)
})

// 🔹 DELETE: Excluir item
app.delete('/cardapio/:id', async (req, res) => {
    const db = await dbPromise
    const { id } = req.params

    const item = await db.get('SELECT * FROM cardapio WHERE id = ?', id)
    if (!item) {
        return res.status(404).json({ erro: 'Item não encontrado' })
    }

    await db.run('DELETE FROM cardapio WHERE id = ?', id)
    res.status(204).send()
})

// ---------------------- SERVIDOR ----------------------------
const PORTA = 8080
app.listen(PORTA, () => {
    console.log(`Aplicação aberta na porta ${PORTA}`)
})

