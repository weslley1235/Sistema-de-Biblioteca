import type { FastifyRequest, FastifyReply } from 'fastify';
import { findBook } from './usecases/index.js';

type FindBookRequest = FastifyRequest<{
  Params: { id: string };
}>;

export async function findBookController(
  request: FindBookRequest,
  reply: FastifyReply,
) {
  const livro = await findBook(request.params.id);

  if (livro.isFail) {
    return reply.code(404).send({
      mensagem: 'Livro não encontrado',
    });
  }

  return reply.send(livro.success?.value);
}
