import type { FastifyReply, FastifyRequest } from 'fastify';

import { loanValidation } from './validator.js';
import { LendBookUsecase } from './usecases/createLoan.js';
import { ListLoansUsecase } from './usecases/listLoans.js';
import { ReturnLoanUsecase } from './usecases/returnLoan.js';

type ReturnLoanRequest = FastifyRequest<{
  Params: { id: string };
}>;

export class LoanController {
  public async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const validation = loanValidation(request.body);

      if (!validation.success) {
        return reply.code(400).send({
          mensagem: validation.error.issues[0].message,
        });
      }

      const result = await new LendBookUsecase().execute(validation.data);

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
      const result = await new ListLoansUsecase().execute();

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
      const result = await new ReturnLoanUsecase().execute(request.params.id);

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
