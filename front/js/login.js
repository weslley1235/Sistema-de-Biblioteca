const loginForm = document.getElementById('formLogin');
const loginMessage = document.getElementById('mensagemLogin');

async function loginUser(event) {
  event.preventDefault();

  const email = document.getElementById('emailLogin').value;
  const password = document.getElementById('senhaLogin').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const result = await response.json();
    loginMessage.textContent = result.message;

    if (response.ok) {
      window.location.href = '/index';
    }
  } catch (error) {
    console.error(error);
    loginMessage.textContent = 'Não foi  concectar ao servidor';
  }
}

loginForm.addEventListener('submit', loginUser);
