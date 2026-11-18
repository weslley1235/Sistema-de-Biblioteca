
const form = document.querySelector('#formulario');
const mensagem = document.querySelector('#mensagem');

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  const user = {
    nome: document.querySelector('#nome').value.trim(),
    email: document.querySelector('#email').value.trim(),
    password: document.querySelector('#senha').value,
    cpf: document.querySelector('#cpf').value.replace(/\D/g, ''),
    tel: document.querySelector('#tel').value.replace(/\D/g, ''),
    tipoUsu: document.querySelector('#tipoUsu').value,
    matricula: document.querySelector('#matricula').value.trim(),
    cep: document.querySelector('#cep').value.replace(/\D/g, ''),
    state: document.querySelector('#state').value.trim(),
    city: document.querySelector('#city').value.trim(),
    street: document.querySelector('#street').value.trim()
  };

  if (user.nome.length < 2) {
    mensagem.textContent = 'O nome deve ter pelo menos 2 caracteres';
    return;
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(user.email)) {
    mensagem.textContent = 'Digite um e-mail válido';
    return;
  }

  if (user.password.length < 8) {
    mensagem.textContent = 'A senha deve ter pelo menos 8 caracteres';
    return;
  }

  if (!/^\d{11}$/.test(user.cpf)) {
    mensagem.textContent = 'O CPF deve conter 11 dígitos';
    return;
  }

  if (!/^\d{11}$/.test(user.tel)) {
    mensagem.textContent = 'O telefone deve conter 11 dígitos';
    return;
  }

  if (!user.tipoUsu) {
    mensagem.textContent = 'Selecione o tipo de usuário';
    return;
  }

  if (user.tipoUsu === 'administracao' && !/^[A-Za-z0-9]{1,15}$/.test(user.matricula)) {
    mensagem.textContent = 'Informe uma matrícula válida';
    return;
  }

  if (!/^\d{8}$/.test(user.cep)) {
    mensagem.textContent = 'O CEP deve conter 8 dígitos';
    return;
  }

  if (!/^[A-Za-z]{2}$/.test(user.state)) {
    mensagem.textContent = 'O estado deve conter 2 letras';
    return;
  }

  if (user.city.length < 2) {
    mensagem.textContent = 'A cidade deve ter pelo menos 2 caracteres';
    return;
  }

  if (user.street.length < 2) {
    mensagem.textContent = 'A rua deve ter pelo menos 2 caracteres';
    return;
  }

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

