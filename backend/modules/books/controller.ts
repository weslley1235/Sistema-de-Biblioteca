import type { FastifyReply, FastifyRequest } from 'fastify';
import { register } from './usecases/index.js';
import { bookValidation } from './validator.js';

export async function requestController(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  try {
    const validation = bookValidation(request.body);

    if (!validation.success) {
      return reply.code(400).send({
        mensagem: validation.error.issues[0].message,
      });
    }

    const resultado = await register(validation.data);

    return reply.code(resultado.status).send({
      mensagem: resultado.message,
    });
  } catch (erro) {
    request.log.error(erro);

    return reply.code(500).send({
      mensagem: 'Erro ao cadastrar livro',
    });
  }
}