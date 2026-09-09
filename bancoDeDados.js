const path = require("path");
const bcrypt = require("bcryptjs");
const Database = require("better-sqlite3");

// Caminho do arquivo do banco (fica na raiz do projeto)
const CAMINHO_DB = path.join(__dirname, "dados.sqlite");

const db = new Database(CAMINHO_DB);

// Cria a tabela caso ainda não exista, já com os campos usados no cadastro
db.exec(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        cpf TEXT NOT NULL UNIQUE,
        dataNascimento TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        criadoEm TEXT DEFAULT CURRENT_TIMESTAMP
    )
`);

async function salvarUsuario(nome, cpf, dataNascimento, email, senha) {
    // Nunca salvar senha em texto puro
    const senhaHash = await bcrypt.hash(senha, 10);

    try {
        const stmt = db.prepare(`
            INSERT INTO usuarios (nome, cpf, dataNascimento, email, senha)
            VALUES (?, ?, ?, ?, ?)
        `);
        const info = stmt.run(nome, cpf, dataNascimento, email, senhaHash);

        return {
            id: info.lastInsertRowid,
            nome,
            cpf,
            dataNascimento,
            email
        };
    } catch (erro) {
        // Erro de UNIQUE (cpf ou email já cadastrados)
        if (String(erro.message).includes("UNIQUE")) {
            const erroAmigavel = new Error("CPF ou e-mail já cadastrados.");
            erroAmigavel.codigo = "DUPLICADO";
            throw erroAmigavel;
        }
        throw erro;
    }
}

async function listarUsuarios() {
    const stmt = db.prepare(`
        SELECT id, nome, cpf, dataNascimento, email, criadoEm
        FROM usuarios
        ORDER BY id DESC
    `);
    return stmt.all();
}

module.exports = { salvarUsuario, listarUsuarios };
