// IMPORTAÇÃO

import fs from "node:fs";

// ARQUIVO DE DADOS

const caminho = "./banco/livros.json";

// LISTAR LIVROS

export function listaLivros() {
  const dados = fs.readFileSync(caminho, "utf8");

  return JSON.parse(dados);
}

// SALVAR LIVROS

export function salvarLivro(livros) {
  fs.writeFileSync(caminho, JSON.stringify(livros, null, 2));
}

// CADASTRAR LIVRO

export function cadastrarLivro(livro) {
  const livros = listaLivros();

  livros.push(livro);

  salvarLivro(livros);
}

// BUSCAR LIVRO PELO ID

export function buscarLivro(id) {
  const livros = listaLivros();

  return livros.find((livro) => livro.id == id);
}

// BUSCAR LIVRO PELO TÍTULO

export function buscarLivroPorTitulo(titulo) {
  const livros = listaLivros();

  return livros.find(
    (livro) => livro.titulo.toLowerCase() == titulo.toLowerCase()
  );
}

// EXCLUIR LIVRO

export function excluirLivro(id) {
  const livros = listaLivros();

  const novoLivro = livros.filter((livro) => livro.id != id);

  salvarLivro(novoLivro);
}

// ATUALIZAR LIVRO

export function atualizarLivro(id, titulo, autor, ano) {
  const livros = listaLivros();

  const livro = livros.find((livro) => livro.id == id);

  if (!livro) {
    return false;
  }

  livro.titulo = titulo;
  livro.autor = autor;
  livro.ano = ano;

  salvarLivro(livros);

  return true;
}
