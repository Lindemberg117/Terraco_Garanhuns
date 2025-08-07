import express from 'express';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import cardapioRouter from './routes/cardapio.js';
import { dbPromise } from './database/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 8080;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/cardapio', cardapioRouter);

async function inicializarBancoDeDados() {
    try {
        const db = await dbPromise;
        
        await db.exec(`
            CREATE TABLE IF NOT EXISTS cardapio (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                descricao TEXT NOT NULL,
                valor REAL NOT NULL,
                img TEXT NOT NULL
            );
            
            CREATE TABLE IF NOT EXISTS pedidos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                clienteId TEXT NOT NULL,
                itens TEXT NOT NULL,
                total REAL NOT NULL,
                data TEXT NOT NULL
            );
        `);
        
        console.log('Tabelas verificadas/criadas com sucesso');
    } catch (error) {
        console.error('Erro ao inicializar banco de dados:', error);
        process.exit(1);
    }
}

app.post('/pedidos', async (req, res) => {
    try {
        const db = await dbPromise;
        const { clienteId, itens, total } = req.body;

        if (!clienteId || !itens || !total) {
            return res.status(400).json({ 
                error: 'Dados incompletos',
                camposObrigatorios: ['clienteId', 'itens', 'total']
            });
        }

        const result = await db.run(
            `INSERT INTO pedidos (clienteId, itens, total, data) VALUES (?, ?, ?, ?)`,
            [clienteId, JSON.stringify(itens), total, new Date().toISOString()]
        );

        res.status(201).json({ 
            success: true,
            pedidoId: result.lastID,
            clienteId,
            total
        });

    } catch (error) {
        console.error('Erro ao criar pedido:', error);
        res.status(500).json({ 
            error: 'Erro ao processar pedido',
            detalhes: error.message
        });
    }
});

app.get('/', (req, res) => {
    res.json({
        status: 'API funcionando',
        endpoints: {
            cardapio: {
                listar: 'GET /cardapio',
                buscar: 'GET /cardapio/:id',
                criar: 'POST /cardapio',
                atualizar: 'PUT /cardapio/:id',
                remover: 'DELETE /cardapio/:id'
            },
            pedidos: {
                criar: 'POST /pedidos'
            }
        }
    });
});

async function iniciarServidor() {
    await inicializarBancoDeDados();
    
    app.listen(PORT, () => {
        console.log(`Servidor rodando na porta ${PORT}`);
        console.log(`Acesse: http://localhost:${PORT}`);
    });
}

iniciarServidor().catch(err => {
    console.error('Falha ao iniciar servidor:', err);
    process.exit(1);
});