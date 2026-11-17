import type { FastifyReply, FastifyRequest } from 'fastify';

import type { IUserRepository } from '../user/repositories';
import type { ILoanRepository } from './repositories';
import type { IBookRepository } from '../books/repositories';

import { loanValidation } from './validator';
import { DatabaseProveders, LendBookFactory } from './usecases/createLoan';
import { ListLoansUsecase } from './usecases/listLoans';
import { ReturnLoanUsecase } from './usecases/returnLoan';

type ReturnLoanRequest = FastifyRequest<{
  Params: { id: string };
}>;

export class LoanController {
  constructor(
    private provider: DatabaseProveders = process.env
      .DATABASE_PROVIDER as DatabaseProveders,
  ) {}

  public async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validation = loanValidation(request.body);

      if (!validation.success) {
        return reply.code(400).send({
          mensagem: validation.error.issues[0].message,
        });
      }

      const lendBookUsecase = LendBookFactory.factory(this.provider);

      const result = await lendBookUsecase.execute(validation.data);

      if (result.isFail) {
        return reply.code(result.error?.metadata?.status ?? 500).send({
          mensagem: result.error?.message ?? 'Erro ao registrar empréstimo',
        });
      }

      return reply.code(201).send({ mensagem: 'Empréstimo confirmado!' });
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({ mensagem: 'Erro ao registrar empréstimo' });
    }
  }

  public async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const listLoansUsecase = new ListLoansUsecase(this.loanRepository);

      const result = await listLoansUsecase.execute();

      if (result.isFail || !result.success) {
        request.log.error(result.error);

        return reply.code(500).send({ mensagem: 'Erro ao listar empréstimos' });
      }

      return reply.send(result.success.value);
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({ mensagem: 'Erro ao listar empréstimos' });
    }
  }

  public async return(request: ReturnLoanRequest, reply: FastifyReply) {
    try {
      const returnLoanUsecase = new ReturnLoanUsecase(this.loanRepository);

      const result = await returnLoanUsecase.execute(request.params.id);

      if (result.isFail) {
        return reply.code(result.error?.metadata?.status ?? 500).send({
          mensagem: result.error?.message ?? 'Erro ao devolver livro',
        });
      }

      return reply.send({ mensagem: 'Livro devolvido com sucesso!' });
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({ mensagem: 'Erro ao devolver livro' });
    }
  }
}
