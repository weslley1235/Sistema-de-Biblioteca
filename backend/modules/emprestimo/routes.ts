
import type { FastifyInstance } from 'fastify';

import { LoanController } from './Loancontroller';

import { MysqlUserRepository } from '../user/repositories';
import { LoanRepository } from './repositories';
import { PostBookRepository } from '../books/repositories';

import {
  requireLoginPage,
  requireLoginApi,
} from '../../shared/authentication';

type IdRoute = {
  Params: { id: string };
};

export default async function loanRoutes(server: FastifyInstance) {
  const userRepository = new MysqlUserRepository();
  const loanRepository = new LoanRepository();
  const bookRepository = new PostBookRepository();

  const loanController = new LoanController(
    userRepository,
    loanRepository,
    bookRepository,
  );

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
    { preHandler: requireLoginApi },
    loanController.create,
  );

  server.get(
    '/emprestimo',
    { preHandler: requireLoginApi },
    loanController.list,
  );

  server.put<IdRoute>(
    '/emprestimo/:id',
    { preHandler: requireLoginApi },
    loanController.return,
  );
}
