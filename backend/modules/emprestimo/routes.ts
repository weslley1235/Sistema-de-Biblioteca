
import type { FastifyInstance } from 'fastify';

import { LoanController } from './Loancontroller';

import { requireLoginPage, requireLoginApi, requireAdminPage, requireAdminApi } from '../../shared/authentication';

type IdRoute = {
  Params: { id: string };
};

export default async function loanRoutes(server: FastifyInstance) {
  const loanController = new LoanController();

  server.get('/livros-emprestados',{ preHandler: requireAdminPage },(request, reply) => reply.sendFile('html/livros_emprestados.html'));

  server.get('/livros-disponiveis',{ preHandler: requireLoginPage },(request, reply) => reply.sendFile('html/livros_disponiveis.html'),);

  server.get('/novo-emprestimo',{ preHandler: requireLoginPage },(request, reply) => reply.sendFile('html/novo_emprestimo.html'));

 
  server.post('/emprestimo',{ preHandler: requireLoginApi },(request, reply) => loanController.create(request, reply));

  server.get('/emprestimo',{ preHandler: requireAdminApi },(request, reply) => loanController.list(request, reply));

  server.put<IdRoute>('/emprestimo/:id',{ preHandler: requireAdminApi },(request, reply) => loanController.return(request, reply));

}
