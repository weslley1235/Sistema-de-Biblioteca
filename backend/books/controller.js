import { register } from './usecases/index.js';

export async function requestHandler(request, reply) {
  try {
    const resultado = await register(request.body);

    return reply.code(resultado.status).send({
      mensagem: resultado.message,
    });
  } catch (erro) {
    request.log.error(erro);

    return reply.code(500).send({
      mensagem: 'Erro interno ao cadastrar livro.',
    });
  }
}