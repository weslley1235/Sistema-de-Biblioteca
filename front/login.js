const formularioLogin = document.getElementById("formLogin");
const mensagemLogin = document.getElementById("mensagemLogin");

formularioLogin.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const email = document.getElementById("emailLogin").value;
  const senha = document.getElementById("senhaLogin").value;

  try {
    const resposta = await fetch("/login", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        senha,
      }),
    });

  
const resultado = await resposta.json();

mensagemLogin.textContent = resultado.mensagem;

if (resposta.ok) {
  window.location.href = "/index";
}
;
  } catch (erro) {
    console.log(erro);
    mensagemLogin.textContent = "Não foi possível conectar ao servidor";
  }
});
