import { update } from './usecases/index.js';

export async function updateController(request, reply) {
  const { id } = request.params;
  const resultado = update(id, request.body);

  return reply.code(resultado.status).send({
    mensagem: resultado.message,
  });
}
