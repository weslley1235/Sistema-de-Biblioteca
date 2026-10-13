
import {createLoanHandler,listLoansHandler,returnLoanHandler} from './handler.js';

export default async function loanRoutes(server) {
  
  function verifyLogin(request, reply, done) {
    if (!request.session.usuario) {
      return reply.redirect('/');
    }

    done();
  }

  const protectedRoute = { preHandler: verifyLogin };

  server.get('/livros-emprestados', protectedRoute, (request, reply) => {
    return reply.sendFile('html/livros_emprestados.html');
  });

  server.get('/livros-disponiveis', protectedRoute, (request, reply) => {
    return reply.sendFile('html/livros_disponiveis.html');
  });

  server.get('/novo-emprestimo', protectedRoute, (request, reply) => {
    return reply.sendFile('html/novo_emprestimo.html');
  });

  server.post('/emprestimo', protectedRoute, createLoanHandler);

  server.get('/emprestimo', protectedRoute, listLoansHandler);

  server.put('/emprestimo/:id', protectedRoute, returnLoanHandler);
}