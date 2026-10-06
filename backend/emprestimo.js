// IMPORTAÇÕES

import fs from "node:fs";
import { z } from "zod";

// ARQUIVO DE DADOS

const caminho = "./banco/emprestimo.json";

// VALIDAÇÃO

export const emprestimoSchema = z.object({
  livroId: z.string().min(1, "Livro é obrigatório"),
  nome: z.string().min(1, "Nome é obrigatório"),
  tel: z.string().min(1, "Telefone é obrigatório"),
  cpfMatri: z.string().min(1, "CPF ou matrícula é obrigatório"),
  dataEmprestimo: z.string().min(1, "Data do empréstimo é obrigatória"),
  dataDevolucao: z.string().min(1, "Data de devolução é obrigatória"),
});

// LISTAR EMPRÉSTIMOS

export function listaEmprestimo() {
  const dados = fs.readFileSync(caminho, "utf8");

  return JSON.parse(dados);
}

// SALVAR EMPRÉSTIMOS

export function salvarEmprestimo(emprestimo) {
  fs.writeFileSync(caminho, JSON.stringify(emprestimo, null, 2));
}

// CADASTRAR EMPRÉSTIMO

export function cadastrarEmprestimo(emprestimo) {
  const lista = listaEmprestimo();

  lista.push(emprestimo);

  salvarEmprestimo(lista);
}

// BUSCAR EMPRÉSTIMO

export function buscarEmprestimo(id) {
  const emprestimo = listaEmprestimo();

  return emprestimo.find((emprestimo) => emprestimo.id == id);
}

// VERIFICAR EMPRÉSTIMO

export function verificarEmprestimo(livroId) {
  const emprestimo = listaEmprestimo();

  return emprestimo.find(
    (emprestimo) =>
      emprestimo.livroId == livroId && emprestimo.devolvido == false,
  );
}

// DEVOLVER EMPRÉSTIMO

export function devolverEmprestimo(id) {
  const emprestimos = listaEmprestimo();

  const emprestimo = emprestimos.find(
    (emprestimo) => emprestimo.id == id
  );

  if (!emprestimo) {
    return false;
  }

  emprestimo.devolvido = true;

  salvarEmprestimo(emprestimos);

  return true;
}
