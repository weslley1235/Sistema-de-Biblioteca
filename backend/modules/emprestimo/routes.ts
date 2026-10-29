import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import {createLoanController,listLoansController,returnLoanController} from './controller.js';

type IdRoute = { Params: { id: string } };

export default async function loanRoutes(server: FastifyInstance) {
  const verifyLogin = async (request: FastifyRequest, reply: FastifyReply) => {
    if (!request.session.get('usuario')) {
      return reply.redirect('/');
    }
  };

  const protectedRoute = { preHandler: verifyLogin };

  server.get('/livros-emprestados', protectedRoute, (request, reply) =>
    reply.sendFile('html/livros_emprestados.html'),
  );

  server.get('/livros-disponiveis', protectedRoute, (request, reply) =>
    reply.sendFile('html/livros_disponiveis.html'),
  );

  server.get('/novo-emprestimo', protectedRoute, (request, reply) =>
    reply.sendFile('html/novo_emprestimo.html'),
  );

  server.post('/emprestimo', protectedRoute, createLoanController);

  server.get('/emprestimo', protectedRoute, listLoansController);

  server.put<IdRoute>('/emprestimo/:id', protectedRoute, returnLoanController);
}
