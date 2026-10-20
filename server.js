import {fastifyStatic,fastifyCookie,fastifySession,path,fileURLToPath} from './backend/config.js';
import server from './backend/fastify.js';

import userRoutes from './backend/user/routes.js';
import loanRoutes from './backend/emprestimo/routes.js';

import { requestController } from './backend/books/controller.js';
import { destroyController } from './backend/books/destroyController.js';
import { updateController } from './backend/books/updateController.js';
import { listBooksController } from './backend/books/listController.js';
import { findBookController } from './backend/books/findBookController.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Configurações
server.register(fastifyCookie);

server.register(fastifySession, {
  secret: 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ',
  cookieName: 'bibliotecaSession',
  cookie: {
    secure: false,
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
  },
});

server.register(fastifyStatic, {
  root: path.join(__dirname, 'front'),
});

// Verificar login
function verificarLogin(request, reply, done) {
  if (!request.session.usuario) {
    return reply.redirect('/');
  }

  done();
}

// Páginas
server.get('/', async (request, reply) => {
  return reply.sendFile('html/cadastro_usu.html');
});

server.get('/index', { preHandler: verificarLogin }, async (request, reply) => {
  return reply.sendFile('html/index.html');
});

server.get('/usuarios', { preHandler: verificarLogin }, async (request, reply) => {
  return reply.sendFile('html/listaUsuarios.html');
});

server.get('/livros-inativos', { preHandler: verificarLogin }, async (request, reply) => {
  return reply.sendFile('html/livros_inativos.html');
});

// Usuários e empréstimos
server.register(userRoutes);
server.register(loanRoutes);

// Livros
server.post('/livro', { preHandler: verificarLogin }, requestController);

server.get('/livro', { preHandler: verificarLogin }, listBooksController);

server.get('/livro/:id', { preHandler: verificarLogin }, findBookController);

server.put('/livro/:id', { preHandler: verificarLogin }, updateController);

server.delete('/livro/:id', { preHandler: verificarLogin }, destroyController);

// Logout
server.get('/logout', async (request, reply) => {
  await request.session.destroy();
  return reply.redirect('/');
});

// Iniciar servidor
try {
  server.listen({
    host: '0.0.0.0',
    port: process.env.PORT ?? 3333,
  });
  console.log('Servidor rodando na porta 3333'); 
} catch (error) {
  throw new Error(error.message);
}
