import {createLoanController,listLoansController,returnLoansController} from './handler.js';

export default async function loanRoutes(server) {
  const verifyLogin = (request, reply, done) => {
    if (!request.session.usuario) {
      return reply.redirect('/');
    }

    done();
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

  server.put('/emprestimo/:id', protectedRoute, returnLoansController);
}
