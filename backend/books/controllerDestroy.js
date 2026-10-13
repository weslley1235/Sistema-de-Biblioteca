import { destroy } from './usecases/index.js';

export async function destroyHandler(request, reply) {
  try {
    const resultado = destroy(request.params.id);

    return reply.code(resultado.status).send({
      mensagem: resultado.message,
    });
  } catch (erro) {
    request.log.error(erro);

    return reply.code(500).send({
      mensagem: 'Erro ao excluir livro',
    });
  }
}
