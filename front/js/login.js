const loginForm = document.querySelector('#formLogin');
const loginMessage = document.querySelector('#mensagemLogin');

const loginUser = async (event) => {
  event.preventDefault();

  const email = document.querySelector('#emailLogin').value;
  const password = document.querySelector('#senhaLogin').value;


  try {
    const response = await fetch('/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    loginMessage.textContent = result.message;

    if (response.ok) window.location.href = '/index';
  } catch {
    loginMessage.textContent = 'Não foi possível conectar ao servidor.';
  }
};

loginForm.addEventListener('submit', loginUser);


