import { listLoans, loanSchema, returnLoan } from './loan.js';
import { registerLoan } from './usecases/createLoan.js';

function asyncHandler(handler) {
  return async (request, reply) => {
    try {
      return await handler(request, reply);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({ mensagem: 'Erro do servidor' });
    }
  };
}

function sendError(reply, statusCode, message) {
  return reply.code(statusCode).send({ mensagem: message });
}

export const createLoanHandler = asyncHandler(async (request, reply) => {
  const result = loanSchema.safeParse(request.body);

  if (!result.success) {
    return sendError(
      reply,
      400,
      result.error.issues[0]?.message ?? 'Dados inválidos',
    );
  }

  const loan = registerLoan(result.data);

  if (loan.error) {
    return sendError(reply, 400, loan.error);
  }

  return reply.code(201).send({
    mensagem: 'Empréstimo confirmado!',
  });
});

export const listLoansHandler = asyncHandler(async (request, reply) => {
  return reply.send(listLoans());
});

export const returnLoanHandler = asyncHandler(async (request, reply) => {
  const returned = returnLoan(request.params.id);

  if (!returned) {
    return sendError(reply, 404, 'Empréstimo não encontrado');
  }

  return reply.send({ mensagem: 'Livro devolvido com sucesso!' });
});
