import { listBooks } from './usecases/index.js';

export async function listBooksController(request, reply) {
  try {
    const livros = listBooks();
    return reply.send(livros);

  } catch (erro) {
      request.log.error(erro);
      return reply.code(500).send({
      mensagem: 'Erro ao listar livros',
    });
  }
}
