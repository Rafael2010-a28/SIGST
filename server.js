const express = require("express");
const path = require("path");
const { salvarUsuario, listarUsuarios } = require("./bancoDeDados");

const app = express();
const PORT = 3000;

app.use(express.json());

// Servir os arquivos da pasta public (index.html, css, imagens, script do front-end)
app.use(express.static(path.join(__dirname, "public")));

app.post("/cadastrar", async (req, res) => {
    try {
        const {
            nome,
            cpf,
            dataNascimento,
            email,
            senha
        } = req.body;

        if (!nome || !cpf || !dataNascimento || !email || !senha) {
            return res.status(400).json({
                erro: "Preencha todos os campos."
            });
        }

        const usuario = await salvarUsuario(
            nome,
            cpf,
            dataNascimento,
            email,
            senha
        );

        res.status(201).json({
            mensagem: "Conta cadastrada com sucesso!",
            usuario
        });

    } catch (erro) {
        console.error(erro);

        if (erro.codigo === "DUPLICADO") {
            return res.status(409).json({ erro: erro.message });
        }

        res.status(500).json({
            erro: "Erro ao cadastrar usuário."
        });
    }
});

app.get("/usuarios", async (req, res) => {
    try {
        const usuarios = await listarUsuarios();
        res.json(usuarios);

    } catch (erro) {
        console.error(erro);
        res.status(500).json({
            erro: "Erro ao buscar usuários."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
