import { update } from './usecases/index.js';

export async function updateController(request, reply) {
  try {
    const { id } = request.params;
    const resultado = update(id, request.body);

    return reply.code(resultado.status).send({
      mensagem: resultado.message,
    });
  } catch (erro) {
    request.log.error(erro);

    return reply.code(500).send({
      mensagem: 'Erro ao atualizar livro',
    });
  }
}
