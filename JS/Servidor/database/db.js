import {open} from 'sqlite'
import sqlite3 from 'sqlite3'

const dbPromise = open(
    {
        filename: './database/cardapio.db',
        driver: sqlite3.Database
    }
)

async function criarTabela() {
    const db = await dbPromise;
    await db.exec(`
        CREATE TABLE IF NOT EXISTS cardapio (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT,
            descricao TEXT,
            valor REAL,
            img TEXT
        )`
    )
}

criarTabela()

export {dbPromise}


