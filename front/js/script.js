// ELEMENTOS DA PÁGINA
const formLivro = document.querySelector('#formLivro');
const title = document.querySelector('#title');
const autor = document.querySelector('#autor');
const ano = document.querySelector('#ano');
const mensagem = document.querySelector('#mensagem');
const listaLivros = document.querySelector('#listaLivros');
const botaoFormulario = formLivro.querySelector('button[type="submit"]');

// LISTAR LIVROS
async function carregarLivros() {
  const resposta = await fetch('/livro');
  const livros = await resposta.json();

  listaLivros.innerHTML = '';

  livros.forEach((livro) => {
    const div = document.createElement('div');
    div.classList.add('livro');

    div.innerHTML = `
      <h3>${livro.title}</h3>
      <p><strong>Autor:</strong> ${livro.autor}</p>
      <p><strong>Ano:</strong> ${livro.ano}</p>
      <div class="botoes">
        <button onclick="editarLivro('${livro.id}', '${livro.title}', '${livro.autor}', '${livro.ano}')" class="btn-atualizar">Atualizar</button>
        <button onclick="excluirLivro('${livro.id}')" class="btn-excluir">Excluir</button>
      </div>`;

    listaLivros.appendChild(div);
  });
}

// EDITAR LIVRO
function editarLivro(id, titleLivro, autorLivro, anoLivro) {
  title.value = titleLivro;
  autor.value = autorLivro;
  ano.value = anoLivro;

  formLivro.dataset.id = id;
  botaoFormulario.textContent = 'Salvar alteração';
  mensagem.textContent = 'Edite os dados do livro e clique em salvar.';
}

// CADASTRAR OU ATUALIZAR LIVRO
formLivro.addEventListener('submit', async function (evento) {
  evento.preventDefault();

  const id = formLivro.dataset.id;

  const dados = {
    title: title.value,
    autor: autor.value,
    ano: Number(ano.value),
  };

  try {
    let resposta;

    if (id) {
      resposta = await fetch(`/livro/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
    } else {
      resposta = await fetch('/livro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados),
      });
    }

    const resultado = await resposta.json();
    mensagem.textContent = resultado.mensagem;

    if (resposta.ok) {
      formLivro.reset();
      delete formLivro.dataset.id;
      botaoFormulario.textContent = 'Cadastrar Livro';
      carregarLivros();
    }
  } catch {
    mensagem.textContent = 'Erro ao cadastrar o livro.';
  }
});

// EXCLUIR LIVRO
async function excluirLivro(id) {
  const resposta = await fetch(`/livro/${id}`, {
    method: 'DELETE',
  });

  const resultado = await resposta.json();
  mensagem.textContent = resultado.mensagem;
  carregarLivros();
}

// DISPONIBILIZAR FUNÇÕES
window.excluirLivro = excluirLivro;
window.editarLivro = editarLivro;

// CARREGAR LIVROS
carregarLivros();

// CARREGAR USUÁRIO LOGADO
async function carregarUsuario() {
  const nome = document.querySelector('#nomeUsuario');

  try {
    const resposta = await fetch('/user/me');
    const usuario = await resposta.json();
    nome.textContent = resposta.ok ? usuario.nome : 'Usuário';
  } catch {
    nome.textContent = 'Usuário';
  }
}

carregarUsuario();
