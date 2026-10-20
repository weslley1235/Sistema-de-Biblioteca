import { listLoans, loanSchema, returnLoan } from './loan.js';
import { lendBook } from './usecases/createLoan.js';

function asyncHandler(handler) {
  return async (request, reply) => {
    try {
      return await handler(request, reply);
    } catch (error) {
      request.log.error(error);
      return reply.code(500).send({
        mensagem: 'Erro do servidor',
      });
    }
  };
}

function sendError(reply, statusCode, message) {
  return reply.code(statusCode).send({
    mensagem: message,
  });
}

async function createLoan(request, reply) {
  const result = loanSchema.safeParse(request.body);

  if (!result.success) {
    return sendError(
      reply,
      400,
      result.error.issues[0]?.message ?? 'Dados inválidos',
    );
  }

  const loan = await lendBook(result.data);

  if (loan.error) {
    return sendError(reply, 400, loan.error);
  }

  return reply.code(201).send({
    mensagem: 'Empréstimo confirmado!',
  });
}

async function getLoans(request, reply) {
  const loans = await listLoans();

  return reply.send(loans);
}

async function returnLoanBook(request, reply) {
  const returned = await returnLoan(request.params.id);

  if (!returned) {
    return sendError(reply, 404, 'Empréstimo não encontrado');
  }

  return reply.send({
    mensagem: 'Livro devolvido com sucesso!',
  });
}

export const createLoanController = asyncHandler(createLoan);
export const listLoansController = asyncHandler(getLoans);
export const returnLoansController = asyncHandler(returnLoanBook);