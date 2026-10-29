import type { FastifyReply, FastifyRequest } from 'fastify'

import { loanValidation } from './validator.js';
import { lendBook } from './usecases/createLoan.js';
import { listLoans } from './usecases/listLoans.js';
import { returnLoan } from './usecases/returnLoan.js';

type ReturnLoanRequest = FastifyRequest<{
  Params: { id: string };
}>

export async function createLoanController(
  request:FastifyRequest, 
  reply:FastifyReply
) {
  try {
    const validation = loanValidation(request.body);

    if (!validation.success) {
      return reply.code(400).send({
        mensagem: validation.error.issues[0].message,
      });
    }

    const loan = await lendBook(validation.data);

    if ('error' in loan) {
      return reply.code(400).send({ mensagem: loan.error });
    }

    return reply.code(201).send({
      mensagem: 'Empréstimo confirmado!',
    });
  } catch (erro) {
    request.log.error(erro);

    return reply.code(500).send({
      mensagem: 'Erro ao registrar empréstimo',
    });
  }
}

export async function listLoansController(
  request: FastifyRequest, 
  reply: FastifyReply
) {
  try {
    const loans = await listLoans();

    return reply.send(loans);
  } catch (erro) {
    request.log.error(erro);

    return reply.code(500).send({
      mensagem: 'Erro ao listar empréstimos',
    });
  }
}

export async function returnLoanController(
  request: ReturnLoanRequest, 
  reply: FastifyReply
) {
  try {
    const returned = await returnLoan(request.params.id);

    if (!returned) {
      return reply.code(404).send({
        mensagem: 'Empréstimo não encontrado',
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