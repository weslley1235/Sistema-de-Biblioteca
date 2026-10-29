import type { FastifyReply, FastifyRequest } from 'fastify'
import { destroy } from './usecases/index.js';

type DestroyRequest = FastifyRequest<{
  Params: {id: string };
  Querystring: { definitive?: string };
}>;

export async function destroyController(
  request: DestroyRequest,
  reply: FastifyReply
) {
  const definitive = request.query.definitive == 'true';
  const resultado = await destroy(request.params.id, definitive);

  return reply.code(resultado.status).send({
    mensagem: resultado.message,
  });
}
