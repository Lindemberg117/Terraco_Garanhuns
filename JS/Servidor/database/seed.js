import { dbPromise } from './db.js';  
// Dados iniciais do cardápio
const cardapio =[
    {
    nome:"tripa",
    descricao:"Tripa acebolada, crocante por fora e suculenta por dentro. Ideal para petiscar com os amigos! ",
    preco: 10.50,
    img:'../IMG/tripa.png'

    },
    {
    nome:"sushi",
    descricao:"Seleção de sushis frescos preparados com ingredientes de qualidade e sabor oriental autêntico.",
    preco: 17.00,
    img:'../IMG/Sushi.png'

    },
    {
    nome:"Camarão",
    descricao:"Camarões grelhados temperados com ervas finas. Um toque do mar no seu prato",
    preco: 12.90,
    img:'../IMG/Camarao.png'

    },
    {
    nome:"Carnes",
    descricao:"Variedade de cortes nobres como picanha, alcatra e fraldinha, preparados na brasa com todo o sabor do churrasco tradicional",
    preco: 13.90,
    img:'../IMG/Carnes.png'

    },
    {
    nome:"Chopp",
    descricao:"Chopp gelado, cremoso e servido na medida para refrescar seus momentos!",
    preco: 10.50,
    img:'../IMG/Chopp.png'

    },
    {
    nome:"Drinks",
    descricao:"Drinks refrescantes e bem elaborados com frutas, hortelã e um toque especial!",
    preco: 10.50,
    img:'../IMG/Mojito.png'

    },
    {
    nome:"Vinho",
    descricao:"Vinhos selecionados para harmonizar com bons momentos. Tintos, brancos ou rosés — escolha o seu preferido! ",
    preco: 10.50,
    img:'../IMG/Vinho.png'

    }
];

// Popula o banco de dados
async function popularBanco() {
    try {
        const db = await dbPromise;
        await db.run("DELETE FROM cardapio");
        
        for (const item of cardapio) {
            await db.run(
                "INSERT INTO cardapio (nome, descricao, preco, img) VALUES (?, ?, ?, ?)",
                [item.nome, item.descricao, item.preco, item.img]
            );
        }
        console.log('Banco populado com sucesso!');
    } catch (error) {
        console.error('Erro ao popular banco:', error);
    }
}

popularBanco();