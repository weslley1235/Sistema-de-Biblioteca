import { listBooks, listInactiveBooks } from './usecases/index.js';

export async function listBooksController(request, reply) {
  try {
    if (request.query.inactive === 'true') {
      return reply.send(await listInactiveBooks());
    }

    return reply.send(await listBooks());
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      mensagem: 'Erro ao listar livros',
    });
  }
}