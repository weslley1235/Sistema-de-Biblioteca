const listaUsuarios = document.querySelector('#listaUsuarios');

async function carregarUsuarios() {
  const usuarios = await (await fetch('/user')).json();

  listaUsuarios.innerHTML = 
  usuarios.map(({ id, nome, email, tel, cpf, tipoUsu }) => `
    <div>
      <h3>${nome}</h3>
      <p>E-mail: ${email}</p>
      <p>Telefone: ${tel}</p>
      <p>CPF: ${cpf}</p>
      <p>Tipo: ${tipoUsu}</p>
      <button onclick="editarUsuario('${id}')">Editar</button>
      <button onclick="excluirUsuario('${id}')">Excluir</button>
    </div>
  `,
    )
    .join('');
}

window.excluirUsuario = async (id) => {
  if (!confirm('Deseja realmente excluir este usuário?')) return;

  const resposta = await fetch(`/user/${id}`, { method: 'DELETE' });
  const resultado = await resposta.json();

  if (!resposta.ok)
    return alert(resultado.message || 'Erro ao excluir usuário.');
  if (resultado.propriaConta) return (window.location.href = '/');

  alert(resultado.message || 'Usuário excluído com sucesso.');
  carregarUsuarios();
};

const formEditar = document.querySelector('#formEditar');

window.editarUsuario = async (id) => {
  const usuarios = await (await fetch('/user')).json();
  const usuario = usuarios.find((user) => String(user.id) === String(id));

  if (!usuario) return alert('Usuário não encontrado.');

  formEditar.dataset.id = id;
  formEditar.nome.value = usuario.nome;
  formEditar.email.value = usuario.email;
  formEditar.tel.value = usuario.tel;
  formEditar.cpf.value = '';

  formEditar.hidden = false;
  formEditar.scrollIntoView({ behavior: 'smooth' });
};

formEditar.addEventListener('submit', async (event) => {
  event.preventDefault();

  const { nome, email, tel, cpf } = formEditar;
  const dados = {
    nome: nome.value,
    email: email.value,
    tel: tel.value,
    ...(cpf.value.trim() && { cpf: cpf.value.trim() }),
  };

  const resposta = await fetch(`/user/${formEditar.dataset.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(dados),
  });

  const resultado = await resposta.json();

  if (!resposta.ok)
    return alert(resultado.message || 'Erro ao atualizar usuário.');

  alert(resultado.message || 'Usuário atualizado com sucesso.');
  formEditar.hidden = true;
  formEditar.reset();
  await carregarUsuarios();
});

document.querySelector('#cancelarEdicao').addEventListener('click', () => {
  formEditar.hidden = true;
  formEditar.reset();
});

carregarUsuarios();
