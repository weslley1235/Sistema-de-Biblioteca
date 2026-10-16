import { register } from './usecases/index.js';

export async function requestController(request, reply) {
  const resultado = await register(request.body);

  return reply.code(resultado.status).send({
    mensagem: resultado.message,
  });
}
