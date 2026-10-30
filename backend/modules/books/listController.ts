import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  FindBookUsecase,
  listBooks,
  listInactiveBooks,
} from './usecases/index.js';

type ListBooksRequest = FastifyRequest<{
  Querystring: { inactive?: string };
}>;

type FindBookRequest = FastifyRequest<{
  Params: { id: string };
}>;

export class BookController {
  // list
  public async detail(request: FindBookRequest, reply: FastifyReply) {
    const livro = await new FindBookUsecase().execute(request.params?.id ?? '');

    if (livro.isFail) {
      return reply.code(404).send({
        mensagem: 'Livro não encontrado',
      });
    }

    return reply.send(livro.success?.value);
  }

  // update
}
