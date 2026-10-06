const formulario = document.getElementById("formulario");
const mensagem = document.getElementById("mensagem");

formulario.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const nome = document.getElementById("nome").value;
  const email = document.getElementById("email").value;
  const senha = document.getElementById("senha").value;
  const cpf_Matri = document.getElementById("cpf_Matri").value;
  const tel = document.getElementById("tel").value;
  const tipoUsu = document.getElementById("tipoUsu").value;

  try {
    const resposta = await fetch("/usuario", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome,
        email,
        senha,
        cpf_Matri,
        tel,
        tipoUsu,
      }),
    });

    const resultado = await resposta.json();

    mensagem.textContent = resultado.mensagem;

    if (resposta.ok) {
      formulario.reset();
    }
  } catch (erro) {
    console.log(erro);
    mensagem.textContent = "Não foi possivel concectar ao servidor";
  }
});
const cartao = document.querySelector(".cartao");
const entrarSistema = document.querySelector("#entrarSistema");
const voltarCadastro = document.querySelector("#voltarCadastro");

entrarSistema.addEventListener("click", () => {
  cartao.classList.add("virado");
});

voltarCadastro.addEventListener("click", () => {
  cartao.classList.remove("virado");
});
