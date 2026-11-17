import { PostBookRepository } from './backend/modules/books/repositories/book.repository';
import {
  fastifyStatic,
  fastifyCookie,
  fastifySession,
  path,
  fileURLToPath,
} from './backend/config';
import {
  ADMIN,
  requireLoginPage,
  requireAdminPage,
  requireLoginApi,
  requireAdminApi,
} from './backend/shared/authentication';
import server from './backend/fastify';

import userRoutes from './backend/modules/user/routes';
import loanRoutes from './backend/modules/emprestimo/routes';

import { BookController } from './backend/modules/books/bookController';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT ?? 3333);

type FindRoute = { Params: { id: string } };
type ListRoute = { Querystring: { inactive?: string } };
type UpdateRoute = {
  Params: { id: string };
  Querystring: { reactivate?: string };
};

type DestroyRoute = {
  Params: { id: string };
  Querystring: { definitive?: string };
};

const bookRepository = new PostBookRepository();
const bookController = new BookController(bookRepository);

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

// Página pública
server.get('/', (request, reply) => {
  return reply.sendFile('html/cadastro_usu.html');
});

// Página para usuários logados
server.get('/index', { preHandler: requireLoginPage }, (request, reply) => {
  return reply.sendFile('html/index.html');
});

// Páginas exclusivas da administração
server.get('/usuarios', { preHandler: requireAdminPage }, (request, reply) => {
  return reply.sendFile('html/listaUsuarios.html');
});

server.get(
  '/livros-inativos',
  { preHandler: requireAdminPage },
  (request, reply) => {
    return reply.sendFile('html/livros_inativos.html');
  },
);

// Usuários e empréstimos

server.register(userRoutes);
server.register(loanRoutes);

// Livros

server.post('/livro', { preHandler: requireAdminApi }, (request, reply) =>
  bookController.register(request, reply),
);
server.get<ListRoute>(
  '/livro',
  { preHandler: requireAdminApi },
  (request, reply) => bookController.list(request, reply),
);
server.get<FindRoute>(
  '/livro/:id',
  { preHandler: requireAdminApi },
  (request, reply) => bookController.detail(request, reply),
);
server.put<UpdateRoute>(
  '/livro/:id',
  { preHandler: requireAdminApi },
  (request, reply) => bookController.update(request, reply),
);
server.delete<DestroyRoute>(
  '/livro/:id',
  { preHandler: requireAdminApi },
  (request, reply) => bookController.destroy(request, reply),
);

// Logout

server.get('/logout', async (request, reply) => {
  await request.session.destroy();
  return reply.redirect('/');
});

// Iniciar servidor

try {
  await server.listen({ host: '0.0.0.0', port: PORT });
  console.log(`Servidor rodando na porta ${PORT}`);
} catch (error) {
  server.log.error(error);
  process.exit(1);
}
