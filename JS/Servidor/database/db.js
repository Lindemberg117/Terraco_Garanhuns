import { open } from 'sqlite';
import sqlite3 from 'sqlite3';

const dbPromise = open({
    filename: './cardapio.db',  // Caminho relativo ao arquivo db.js
    driver: sqlite3.Database
});

// Criação da tabela (executada automaticamente quando o módulo é carregado)
async function criarTabela() {
    try {
        const db = await dbPromise;
        await db.exec(`
            CREATE TABLE IF NOT EXISTS cardapio (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nome TEXT NOT NULL,
                descricao TEXT NOT NULL,
                preco REAL NOT NULL,
                img TEXT NOT NULL
            );
        `);
        console.log('Tabela `cardapio` criada/verificada.');
    } catch (error) {
        console.error('Erro ao criar tabela:', error);
        throw error;
    }
}

criarTabela().catch(err => console.error('Falha na inicialização do banco:', err));

export { dbPromise };