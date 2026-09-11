document.getElementById("salvar").addEventListener("click", async () => {
    const nome = document.getElementById("nome").value.trim();
    const cpf = document.getElementById("cpf").value.trim();
    const dataNascimento = document.getElementById("dataNascimento").value;
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;

    if (!nome || !cpf || !dataNascimento || !email || !senha) {
        alert("Preencha todos os campos.");
        return;
    }

    try {
        const resposta = await fetch("/cadastrar", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ nome, cpf, dataNascimento, email, senha })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            alert(dados.erro || "Erro ao cadastrar usuário.");
            return;
        }

        alert(dados.mensagem);
        document.querySelectorAll("input").forEach(campo => campo.value = "");

    } catch (erro) {
        console.error(erro);
        alert("Não foi possível conectar ao servidor.");
    }
});
