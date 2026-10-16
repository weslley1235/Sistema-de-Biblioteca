import { bookValidation } from './validator.js';
import { register } from './usecases/index.js';

export async function requestHandler(request, reply) {
  try {
    const validation = bookValidation(request.body);
    if (!validation.success) {
      return {
        status: 400,
        message: validation.error.issues[0].message,
      };
    }

    const save = await register(request.body);

    return save;
  } catch (erro) {
    console.log('Erro ao cadastrar livro:', erro);

    return reply.status(500).send({
      mensagem: 'Erro do servidor',
    });
  }
}
