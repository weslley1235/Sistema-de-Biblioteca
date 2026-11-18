
const loginForm = document.querySelector('#formLogin');
const loginMessage = document.querySelector('#mensagemLogin');

const abaLogin = document.querySelector('#abaLogin');
const abaCadastro = document.querySelector('#abaCadastro');

const painelLogin = document.querySelector('#painelLogin');
const painelCadastro = document.querySelector('#painelCadastro');

const tipoLogin = document.querySelector('#tipoLogin');
const campoCpfLogin = document.querySelector('#campoCpfLogin');
const campoMatriculaLogin = document.querySelector('#campoMatriculaLogin');

tipoLogin.addEventListener('change', () => {
  campoCpfLogin.hidden = true;
  campoMatriculaLogin.hidden = true;

  document.querySelector('#cpfLogin').required = false;
  document.querySelector('#matriculaLogin').required = false;

  if (tipoLogin.value === 'administracao') {
    campoMatriculaLogin.hidden = false;
    document.querySelector('#matriculaLogin').required = true;
  } else if (tipoLogin.value === 'Aluno' || tipoLogin.value === 'Professor') {
    campoCpfLogin.hidden = false;
    document.querySelector('#cpfLogin').required = true;
  }
});

const loginUser = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#emailLogin').value;
  const password = document.querySelector('#senhaLogin').value;
  const cpf = document.querySelector('#cpfLogin').value;
  const matricula = document.querySelector('#matriculaLogin').value;

  const user = {
    email,
    password,
  };

  if (tipoLogin.value === 'administracao') {
    user.matricula = matricula;
  } else {
    user.cpf = cpf;
  }

  try {
    const response = await fetch('/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(user),
    });

    const result = await response.json();
    loginMessage.textContent = result.message;

    if (response.ok) window.location.href = '/index';
  } catch {
    loginMessage.textContent = 'Não foi possível conectar ao servidor.';
  }
};

loginForm.addEventListener('submit', loginUser);

abaLogin.addEventListener('click', () => {
  painelLogin.hidden = false;
  painelCadastro.hidden = true;

  abaLogin.classList.add('ativa');
  abaCadastro.classList.remove('ativa');
});

abaCadastro.addEventListener('click', () => {
  painelLogin.hidden = true;
  painelCadastro.hidden = false;

  abaCadastro.classList.add('ativa');
  abaLogin.classList.remove('ativa');
});
