const form = document.querySelector('#formulario');
const mensagem = document.querySelector('#mensagem');
const card = document.querySelector('.cartao');

form.addEventListener('submit', async (event) => {
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
    mensagem.textContent = result.message;

    if (response.ok) window.location.href = '/index';
  } catch {
    mensagem.textContent = 'Não foi possível conectar ao servidor';
  }
});

document.querySelector('#entrarSistema').onclick = () =>
  card.classList.add('virado');

document.querySelector('#voltarCadastro').onclick = () =>
  card.classList.remove('virado');
