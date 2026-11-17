import type { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { LoanController } from './Loancontroller';

import {
  requireLoginPage,
  requireAdminPage,
  requireLoginApi,
  requireAdminApi,
} from '../../shared/authentication';

type IdRoute = { Params: { id: string } };

export default async function loanRoutes(server: FastifyInstance) {
  const loanController = new LoanController();

  server.get(
    '/livros-emprestados',
    { preHandler: requireLoginPage },
    (request, reply) => reply.sendFile('html/livros_emprestados.html'),
  );

  server.get(
    '/livros-disponiveis',
    { preHandler: requireLoginPage },
    (request, reply) => reply.sendFile('html/livros_disponiveis.html'),
  );

  server.get(
    '/novo-emprestimo',
    { preHandler: requireLoginPage },
    (request, reply) => reply.sendFile('html/novo_emprestimo.html'),
  );

  server.post(
    '/emprestimo',
    { preHandler: requireLoginPage },
    loanController.create,
  );

  server.get(
    '/emprestimo',
    { preHandler: requireLoginPage },
    loanController.list,
  );

  server.put<IdRoute>(
    '/emprestimo/:id',
    { preHandler: requireLoginPage },
    loanController.return,
  );
}
