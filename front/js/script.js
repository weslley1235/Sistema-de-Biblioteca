const formLivro = document.querySelector('#formLivro');
const title = document.querySelector('#title');
const autor = document.querySelector('#autor');
const ano = document.querySelector('#ano');
const mensagem = document.querySelector('#mensagem');
const listaLivros = document.querySelector('#listaLivros');
const botaoFormulario = formLivro.querySelector('button[type="submit"]');

const carregarLivros = async () => {
  const respostaLivros = await fetch('/livro');
  const livros = await respostaLivros.json();

  const respostaEmprestimos = await fetch('/emprestimo');
  const emprestimos = await respostaEmprestimos.json();

  listaLivros.innerHTML = '';

  livros.forEach((livro) => {
    const emprestado = emprestimos.some(
      (emprestimo) =>
        emprestimo.livroId === livro.id && emprestimo.devolvido === false,
    );

    const div = document.createElement('div');
    div.classList.add('livro');

    div.innerHTML = `
      <div class="titulo-livro">
        <h3>${livro.title}</h3>
        <span class="status-livro ${emprestado ? 'emprestado' : 'disponivel'}">
          <span class="bolinha"></span>
          ${emprestado ? 'Emprestado' : 'Disponível'}
        </span>
      </div>
      <p><strong>Autor:</strong> ${livro.autor}</p>
      <p><strong>Ano:</strong> ${livro.ano}</p>
      <div class="botoes">
        <button onclick="editarLivro('${livro.id}', '${livro.title}', '${livro.autor}', '${livro.ano}')" class="btn-atualizar">Atualizar</button>
        <button onclick="excluirLivro('${livro.id}')" class="btn-excluir">Excluir</button>
      </div>
    `;

    listaLivros.appendChild(div);
  });
};

const editarLivro = (id, titleLivro, autorLivro, anoLivro) => {
  title.value = titleLivro;
  autor.value = autorLivro;
  ano.value = anoLivro;

  formLivro.dataset.id = id;
  botaoFormulario.textContent = 'Salvar alteração';
  mensagem.textContent = 'Edite os dados do livro e clique em salvar.';
};

formLivro.addEventListener('submit', async (evento) => {
  evento.preventDefault()

  const id = formLivro.dataset.id;
  const dados = {
    title: title.value,
    autor: autor.value,
    ano: Number(ano.value),
  };

  try {
    const resposta = await fetch(id ? `/livro/${id}` : '/livro', {
      method: id ? 'PUT' : 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dados),
    });

    const resultado = await resposta.json();
    mensagem.textContent = resultado.mensagem;

    if (resposta.ok) {
      formLivro.reset();
      delete formLivro.dataset.id;
      botaoFormulario.textContent = 'Cadastrar Livro';
      await carregarLivros();
    }
  } catch {
    mensagem.textContent = 'Erro ao salvar o livro.';
  }
});

const excluirLivro = async (id) => {
  try {
    const resposta = await fetch(`/livro/${id}`, {
      method: 'DELETE',
    });

    const resultado = await resposta.json();
    mensagem.textContent = resultado.mensagem;

    if (resposta.ok) await carregarLivros();
  } catch {
    mensagem.textContent = 'Erro ao excluir o livro.';
  }
};

const carregarUsuario = async () => {
  const nome = document.querySelector('#nomeUsuario');

  try {
    const resposta = await fetch('/user/me');
    const usuario = await resposta.json();
    nome.textContent = resposta.ok ? usuario.nome : 'Usuário';
  } catch {
    nome.textContent = 'Usuário';
  }
};

window.editarLivro = editarLivro;
window.excluirLivro = excluirLivro;

carregarLivros();
carregarUsuario();
