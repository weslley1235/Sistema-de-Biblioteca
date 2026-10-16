import { destroy } from './usecases/index.js';

export async function destroyController(request, reply) {
  const resultado = destroy(request.params.id);

  return reply.code(resultado.status).send({
    mensagem: resultado.message,
  });
}
