const registerForm = document.querySelector('#formulario');
const registerMessage = document.querySelector('#mensagem');
const card = document.querySelector('.cartao');

async function registerUser(event) {
  event.preventDefault();

  const user = {
    nome: document.querySelector('#nome').value,
    email: document.querySelector('#email').value,
    password: document.querySelector('#senha').value,
    cpf: document.querySelector('#cpf').value,
    tel: document.querySelector('#tel').value,
    tipoUsu: document.querySelector('#tipoUsu').value,
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

document.querySelector('#entrarSistema').addEventListener('click', () => {
  card.classList.add('virado');
});

document.querySelector('#voltarCadastro').addEventListener('click', () => {
  card.classList.remove('virado');
});
