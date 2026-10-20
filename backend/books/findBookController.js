import { findBook } from './usecases/index.js';

export async function findBookController(request, reply) {
  try {
    const livro = await findBook(request.params.id);

    if (!livro) {
      return reply.code(404).send({
        mensagem: 'Livro não encontrado',
      });
    }

    return reply.send(livro);
  } catch (erro) {
    request.log.error(erro);

    return reply.code(500).send({
      mensagem: 'Erro ao buscar livro',
    });
  }
}