import type { FastifyReply, FastifyRequest } from 'fastify'

import { listBooks, listInactiveBooks } from './usecases/index.js';

type ListBooksRequest = FastifyRequest<{
  Querystring: { inactive?: string };
}>

export async function listBooksController(
  request: ListBooksRequest,
  reply: FastifyReply
) {
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