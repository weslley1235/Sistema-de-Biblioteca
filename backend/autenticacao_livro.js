// IMPORTAÇÕES

import { cadastrarLivro, buscarLivroPorTitulo } from "./livros.js";
import { z } from "zod";
import { v4 as uuidv4 } from "uuid";


// VALIDAÇÃO

const livroSchema = z.object({
  titulo: z.string().min(1, "Titulo obrigatorio"),
  autor: z.string().min(1, "Autor é obrigatorio"),
  ano: z.number().min(1, "Ano é obrigatorio"),
});


// CADASTRAR LIVRO

export async function registrar(titulo, autor, ano) {

  const resultado = livroSchema.safeParse({
    titulo,
    autor,
    ano,
  });

  if (!resultado.success) {
    return {
      status: 400,
      mensagem: resultado.error.issues[0].message,
    };
  }

  const livros = buscarLivroPorTitulo(titulo);

  if (livros) {
    return {
      status: 409,
      mensagem: "Esse livro já tem cadastro",
    };
  }

  await cadastrarLivro({
    id: uuidv4(),
    titulo,
    autor,
    ano,
  });

  return {
    status: 201,
    mensagem: "Livro cadastrado com sucesso",
  };
}

