import type { FastifyReply, FastifyRequest } from 'fastify';
import { update, reactivate } from './usecases/index.js';
import { bookValidation } from './validator.js';

type UpdateRequest = FastifyRequest<{
  Params: { id: string };
  Querystring: { reactivate?: string };
}>;

export async function updateController(
  request: UpdateRequest,
  reply: FastifyReply,
) {
  try {
    if (request.query.reactivate === 'true') {
      const reactivated = await reactivate(request.params.id);

      if (!reactivated) {
        return reply.code(404).send({
          mensagem: 'Livro não encontrado ou já ativo',
        });
      }

      return reply.send({
        mensagem: 'Livro reativado com sucesso',
      });
    }

    const validation = bookValidation(request.body);

    if (!validation.success) {
      return reply.code(400).send({
        mensagem: validation.error.issues[0].message,
      });
    }

    const resultado = await update(request.params.id, validation.data);

    return reply.code(resultado.status).send({
      mensagem: resultado.message,
    });
  } catch (error) {
    request.log.error(error);

    return reply.code(500).send({
      mensagem: 'Erro ao atualizar livro',
    });
  }
}
