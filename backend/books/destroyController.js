import { destroy } from './usecases/index.js';

export async function destroyController(request, reply) {
  const definitive = request.query.definitive == 'true';
  const resultado = await destroy(request.params.id, definitive);

  return reply.code(resultado.status).send({
    mensagem: resultado.message,
  });
}
