
const lista = document.querySelector('#listaLivrosInativos');

async function carregarLivros() {
  try {
    const resposta = await fetch('/livro?inactive=true');

    if (!resposta.ok) {
      throw new Error('Erro ao carregar livros');
    }

    const livros = await resposta.json();
    lista.innerHTML = '';

    if (livros.length === 0) {
      lista.textContent = 'Não existem livros inativos.';
      return;
    }

    livros.forEach((livro) => {
      const div = document.createElement('div');
      div.classList.add('livro');

      div.innerHTML = `
        <div class="titulo-livro">
          <h3>${livro.title}</h3>
          <span class="status-livro">
            <span class="bolinha"></span>
            Inativo
          </span>
        </div>

        <p><strong>Autor:</strong> ${livro.autor}</p>
        <p><strong>Ano:</strong> ${livro.ano}</p>

        <div class="botoes">
          <button onclick="reativar('${livro.id}')" class="btn-atualizar">
            Reativar
          </button>
          <button onclick="excluir('${livro.id}')" class="btn-excluir">
            Excluir
          </button>
        </div>
      `;

      lista.appendChild(div);
    });
  } catch {
    lista.textContent = 'Erro ao carregar livros inativos.';
  }
}

async function reativar(id) {
  try {
    const resposta = await fetch(`/livro/${id}?reactivate=true`, {
      method: 'PUT',
    });

    if (!resposta.ok) {
      throw new Error('Erro ao reativar livro');
    }

    await carregarLivros();
  } catch {
    alert('Não foi possível reativar o livro.');
  }
}

async function excluir(id) {
  if (!confirm('Excluir o livro e seu histórico de empréstimos?')) {
    return;
  }

  try {
    const resposta = await fetch(`/livro/${id}?definitive=true`, {
      method: 'DELETE',
    });

    if (!resposta.ok) {
      throw new Error('Erro ao excluir livro');
    }

    await carregarLivros();
  } catch {
    alert('Não foi possível excluir o livro.');
  }
}

window.reativar = reativar;
window.excluir = excluir;

carregarLivros();
