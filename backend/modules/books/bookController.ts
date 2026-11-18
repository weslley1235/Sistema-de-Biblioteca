import type { FastifyReply, FastifyRequest } from 'fastify';

import { bookValidation } from './validator.js';
import {getDatabaseProvider,type DatabaseProvider} from '../../shared/index.js';
import {DestroyBookFactory,FindBookFactory,ListBooksFactory,ListInactiveBooksFactory,ReactivateBookFactory,RegisterBookFactory,UpdateBookFactory} from './usecases/index.js';
import type { BookResponse } from './usecases/types.js';

type ListBooksRequest = FastifyRequest<{
  Querystring: { inactive?: string };
}>;

type FindBookRequest = FastifyRequest<{
  Params: { id: string };
}>;

type UpdateBookRequest = FastifyRequest<{
  Params: { id: string };
  Querystring: { reactivate?: string };
}>;

type DestroyBookRequest = FastifyRequest<{
  Params: { id: string };
  Querystring: { definitive?: string };
}>;

export class BookController {
  constructor(
    private readonly provider: DatabaseProvider = getDatabaseProvider(),
  ) {}

  public async list(request: ListBooksRequest, reply: FastifyReply) {
    try {
      const usecase =
        request.query.inactive === 'true'
          ? ListInactiveBooksFactory.factory(this.provider)
          : ListBooksFactory.factory(this.provider);

      const result = await usecase.execute();

      if (result.isFail || !result.success) {
        request.log.error(result.error);

        return reply.code(500).send({ mensagem: 'Erro ao listar livros' });
      }

      return reply.send(result.success.value);
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({ mensagem: 'Erro ao listar livros' });
    }
  }

  public async detail(request: FindBookRequest, reply: FastifyReply) {
    try {
      const findBookUsecase = FindBookFactory.factory(this.provider);
      const livro = await findBookUsecase.execute(request.params?.id ?? '');

      if (livro.isFail) {
        return reply.code(404).send({ mensagem: 'Livro não encontrado' });
      }

      return reply.send(livro.success?.value);
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({ mensagem: 'Erro ao buscar livro' });
    }
  }

  public async register(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validation = bookValidation(request.body);

      if (!validation.success) {
        return reply.code(400).send({
          mensagem: validation.error.issues[0].message,
        });
      }

      const registerBookUsecase = RegisterBookFactory.factory(this.provider);
      const result = await registerBookUsecase.execute(validation.data);

      if (result.isFail) {
        return this.sendFailure(reply, result);
      }

      return reply.code(201).send({ mensagem: 'Livro cadastrado com sucesso' });
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({ mensagem: 'Erro ao cadastrar livro' });
    }
  }

  public async update(request: UpdateBookRequest, reply: FastifyReply) {
    try {
      const { id } = request.params;

      if (request.query.reactivate === 'true') {
        const reactivateBookUsecase = ReactivateBookFactory.factory(
          this.provider,
        );
        const reactivated = await reactivateBookUsecase.execute(id);

        if (reactivated.isFail) {
          return this.sendFailure(reply, reactivated);
        }

        return reply.send({ mensagem: 'Livro reativado com sucesso' });
      }

      const validation = bookValidation(request.body);

      if (!validation.success) {
        return reply.code(400).send({
          mensagem: validation.error.issues[0].message,
        });
      }

      const updateBookUsecase = UpdateBookFactory.factory(this.provider);
      const updated = await updateBookUsecase.execute({
        id,
        data: validation.data,
      });

      if (updated.isFail) {
        return this.sendFailure(reply, updated);
      }

      return reply.send({ mensagem: 'Livro atualizado com sucesso' });
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({ mensagem: 'Erro ao atualizar livro' });
    }
  }

  public async destroy(request: DestroyBookRequest, reply: FastifyReply) {
    try {
      const definitive = request.query.definitive === 'true';

      const destroyBookUsecase = DestroyBookFactory.factory(this.provider);
      const result = await destroyBookUsecase.execute({
        id: request.params.id,
        definitive,
      });

      if (result.isFail) {
        return this.sendFailure(reply, result);
      }

      return reply.send({
        mensagem: definitive
          ? 'Livro e histórico de empréstimos excluídos com sucesso'
          : 'Livro inativado com sucesso',
      });
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({ mensagem: 'Erro ao excluir livro' });
    }
  }

  private sendFailure(reply: FastifyReply, result: BookResponse) {
    return reply.code(result.error?.metadata?.status ?? 500).send({
      mensagem: result.error?.message ?? 'Erro inesperado',
    });
  }
}
