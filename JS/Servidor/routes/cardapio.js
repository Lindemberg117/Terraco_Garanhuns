import {
    Router
} from "express";
import {
    dbPromise
} from "../database/db.js";

const cardapioRouter = Router();

// Rota GET única (removi as duplicações)
cardapioRouter.get("/", async (req, res) => {
    try {
        const db = await dbPromise;
        const itens = await db.all("SELECT * FROM cardapio");
        res.status(200).json(itens);
    } catch (error) {
        console.error("Erro ao buscar cardápio:", error);
        res.status(500).json({
            mensagem: "Erro interno no servidor."
        });
    }
});

// Rota POST corrigida (use valor em vez de preco)
cardapioRouter.post("/", async (req, res) => {
    try {
        // Verificação EXTRA do corpo
        if (!req.body || Object.keys(req.body).length === 0) {
            return res.status(400).json({
                mensagem: "O corpo da requisição está vazio ou inválido",
                sugestao: "Envie um JSON válido com Content-Type: application/json"
            });
        }

        const { nome, descricao, valor, img } = req.body;
        
        // Validação melhorada
        const camposObrigatorios = { nome, descricao, valor, img };
        const camposFaltantes = Object.entries(camposObrigatorios)
            .filter(([_, value]) => value === undefined || value === null || value === "")
            .map(([key]) => key);

        if (camposFaltantes.length > 0) {
            return res.status(400).json({
                mensagem: "Campos obrigatórios faltando",
                camposFaltantes,
                exemploCorreto: {
                    nome: "string",
                    descricao: "string",
                    valor: "number",
                    img: "string"
                }
            });
        }

        const db = await dbPromise;
        const result = await db.run(
            "INSERT INTO cardapio (nome, descricao, valor, img) VALUES (?, ?, ?, ?)",
            [nome, descricao, valor, img]
        );

        const novoItem = await db.get("SELECT * FROM cardapio WHERE id = ?", result.lastID);
        return res.status(201).json(novoItem);

    } catch (error) {
        console.error("Erro completo:", {
            mensagem: error.message,
            stack: error.stack,
            bodyRecebido: req.body,
            headers: req.headers
        });
        return res.status(500).json({ 
            mensagem: "Erro ao processar requisição",
            detalhe: error.message,
            sugestao: "Verifique o console do servidor para detalhes"
        });
    }
});

// Rotas PUT e DELETE (já corretas)
cardapioRouter.put("/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const {
            nome,
            descricao,
            valor,
            img
        } = req.body;
        const db = await dbPromise;

        const itemExistente = await db.get("SELECT * FROM cardapio WHERE id = ?", id);
        if (!itemExistente) {
            return res.status(404).json({
                mensagem: "Item não encontrado."
            });
        }

        await db.run(
            "UPDATE cardapio SET nome = ?, descricao = ?, valor = ?, img = ? WHERE id = ?",
            [nome || itemExistente.nome,
                descricao || itemExistente.descricao,
                valor || itemExistente.valor,
                img || itemExistente.img,
                id
            ]
        );

        const itemAtualizado = await db.get("SELECT * FROM cardapio WHERE id = ?", id);
        res.status(200).json(itemAtualizado);

    } catch (error) {
        console.error("Erro ao atualizar item:", error);
        res.status(500).json({
            mensagem: "Erro ao atualizar item."
        });
    }
});

cardapioRouter.delete("/:id", async (req, res) => {
    try {
        const {
            id
        } = req.params;
        const db = await dbPromise;

        const itemExistente = await db.get("SELECT * FROM cardapio WHERE id = ?", id);
        if (!itemExistente) {
            return res.status(404).json({
                mensagem: "Item não encontrado."
            });
        }

        await db.run("DELETE FROM cardapio WHERE id = ?", id);
        res.status(204).send();

    } catch (error) {
        console.error("Erro ao remover item:", error);
        res.status(500).json({
            mensagem: "Erro ao remover item."
        });
    }
});

export default cardapioRouter;