import moment from 'moment';

import type { FastifyReply, FastifyRequest } from 'fastify';

import {
  getDatabaseProvider,
  type DatabaseProvider,
} from '../../shared/index.js';
import { loanValidation } from './validator.js';
import { LendBookFactory } from './usecases/createLoan.js';
import {
  ListActiveBookIdsFactory,
  ListLoansFactory,
} from './usecases/listLoans.js';
import { ReturnLoanFactory } from './usecases/returnLoan.js';

moment.locale('pt-br');

type ReturnLoanRequest = FastifyRequest<{
  Params: { id: string };
}>;

export class LoanController {
  constructor(
    private readonly provider: DatabaseProvider = getDatabaseProvider(),
  ) {}

  public async create(request: FastifyRequest, reply: FastifyReply) {
    try {
      const usuario = request.session.get('usuario');

      if (!usuario) {
        return reply.code(401).send({
          mensagem: 'Usuário não autenticado',
        });
      }

      const validation = loanValidation(request.body);

      if (!validation.success) {
        return reply.code(400).send({
          mensagem: validation.error.issues[0].message,
        });
      }

      const lendBookUsecase = LendBookFactory.factory(this.provider);
      const result = await lendBookUsecase.execute(validation.data, usuario);

      if (result.isFail) {
        return reply.code(result.error?.metadata?.status ?? 500).send({
          mensagem: result.error?.message ?? 'Erro ao registrar empréstimo',
        });
      }

      const dataEmprestimo = moment(validation.data.dataEmprestimo)
        .locale('pt-br')
        .format('D [de] MMMM [de] YYYY [às] HH:mm:ss');

      return reply.code(201).send({
        mensagem: 'Empréstimo confirmado!',
        dataEmprestimo,
      });
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({
        mensagem: 'Erro ao registrar empréstimo',
      });
    }
  }

  public async list(request: FastifyRequest, reply: FastifyReply) {
    try {
      const usuario = request.session.get('usuario');

      if (!usuario) {
        return reply.code(401).send({
          mensagem: 'Usuário não autenticado',
        });
      }

      const listLoansUsecase = ListLoansFactory.factory(this.provider);
      const result = await listLoansUsecase.execute(usuario);

      if (result.isFail || !result.success) {
        request.log.error(result.error);

        return reply.code(500).send({
          mensagem: 'Erro ao listar empréstimos',
        });
      }

      return reply.send(result.success.value);
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({
        mensagem: 'Erro ao listar empréstimos',
      });
    }
  }

  public async activeBooks(request: FastifyRequest, reply: FastifyReply) {
    try {
      const listActiveBookIdsUsecase = ListActiveBookIdsFactory.factory(
        this.provider,
      );
      const result = await listActiveBookIdsUsecase.execute();

      if (result.isFail || !result.success) {
        request.log.error(result.error);

        return reply.code(500).send({
          mensagem: 'Erro ao listar livros emprestados',
        });
      }

      return reply.send(result.success.value);
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({
        mensagem: 'Erro ao listar livros emprestados',
      });
    }
  }

  public async return(request: ReturnLoanRequest, reply: FastifyReply) {
    try {
      const returnLoanUsecase = ReturnLoanFactory.factory(this.provider);
      const result = await returnLoanUsecase.execute(request.params.id);

      if (result.isFail) {
        return reply.code(result.error?.metadata?.status ?? 500).send({
          mensagem: result.error?.message ?? 'Erro ao devolver livro',
        });
      }

      return reply.send({
        mensagem: 'Livro devolvido com sucesso!',
      });
    } catch (erro) {
      request.log.error(erro);

      return reply.code(500).send({
        mensagem: 'Erro ao devolver livro',
      });
    }
  }
}
