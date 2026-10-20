import { update, reactivate } from './usecases/index.js';

export async function updateController(request, reply) {
  try {
    let resultado;

    if (request.query.reactivate === 'true') {
      const reactivated = await reactivate(request.params.id);

      if (reactivated) {
        resultado = {
          status: 200,
          message: 'Livro reativado com sucesso',
        };
      } else {
        resultado = {
          status: 404,
          message: 'Livro não encontrado ou já ativo',
        };
      }
    } else {
      resultado = await update(request.params.id, request.body);
    }

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
