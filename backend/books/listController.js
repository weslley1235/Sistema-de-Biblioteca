import { listBooks, listInactiveBooks } from './usecases/index.js';

export async function listBooksController(request, reply) {
  try {
    let livros;

    if (request.query.inactive === 'true') {
      livros = await listInactiveBooks();
    } else {
      livros = await listBooks();
    }

    return reply.send(livros);
  } catch (erro) {
    request.log.error(erro);
    return reply.code(500).send({
      mensagem: 'Erro ao listar livros',
    });
  }
}