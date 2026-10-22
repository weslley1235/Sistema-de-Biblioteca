import { update, reactivate } from './usecases/index.js';

export async function updateController(request, reply) {
  try {
    if (request.query.reactivate === 'false') {
      const resultado = await update(request.params.id, request.body);

      return reply.code(resultado.status).send({
        mensagem: resultado.message,
      });
    }

    const reactivated = await reactivate(request.params.id);

    if (!reactivated) {
      return reply.code(404).send({
        mensagem: 'Livro não encontrado ou já ativo',
      });
    }

    return reply.code(200).send({
      mensagem: 'Livro reativado com sucesso',
    });
  } catch (erro) {
    request.log.error(erro);

    return reply.code(500).send({
      mensagem: 'Erro ao atualizar livro',
    });
  }
}
