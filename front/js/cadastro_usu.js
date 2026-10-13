const registerForm = document.getElementById('formulario');
const registerMessage = document.getElementById('mensagem');
const card = document.querySelector('.cartao');

async function registerUser(event) {
  event.preventDefault();

  const user = {
    nome: document.getElementById('nome').value,
    email: document.getElementById('email').value,
    password: document.getElementById('senha').value,
    cpf: document.getElementById('cpf').value,
    tel: document.getElementById('tel').value,
    tipoUsu: document.getElementById('tipoUsu').value,
  };

  try {
    const response = await fetch('/user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    const result = await response.json();
    registerMessage.textContent = result.message;

    if (response.ok) {
      window.location.href = '/index';
    }
  } catch (error) {
    console.error(error);
    registerMessage.textContent = 'Não foi possível conectar ao servidor';
  }
}

registerForm.addEventListener('submit', registerUser);

document.getElementById('entrarSistema').addEventListener('click', () => {
  card.classList.add('virado');
});

document.getElementById('voltarCadastro').addEventListener('click', () => {
  card.classList.remove('virado');
});

  