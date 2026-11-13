import type { FastifyRequest, FastifyReply } from 'fastify';
import {
  fastifyStatic,
  fastifyCookie,
  fastifySession,
  path,
  fileURLToPath,
} from './backend/config.js';
import server from './backend/fastify.js';

import userRoutes from './backend/modules/user/routes.js';
import loanRoutes from './backend/modules/emprestimo/routes.js';

import { BookController } from './backend/modules/books/listController.js';

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

const bookController = new BookController();

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

async function verificarLogin(request: FastifyRequest, reply: FastifyReply) {
  if (!request.session.get('usuario')) {
    return reply.redirect('/');
  }
}

const protegida = { preHandler: verificarLogin };

// Páginas

const paginasProtegidas = {
  '/index': 'html/index.html',
  '/usuarios': 'html/listaUsuarios.html',
  '/livros-inativos': 'html/livros_inativos.html',
};

server.get('/', (request, reply) => reply.sendFile('html/cadastro_usu.html'));

for (const [rota, arquivo] of Object.entries(paginasProtegidas)) {
  server.get(rota, protegida, (request, reply) => reply.sendFile(arquivo));
}

// Usuários e empréstimos

server.register(userRoutes);
server.register(loanRoutes);

// Livros

server.post('/livro', protegida, (request, reply) => bookController.register(request, reply));
server.get<ListRoute>('/livro', protegida, (request, reply) => bookController.list(request, reply));
server.get<FindRoute>('/livro/:id', protegida, (request, reply) => bookController.detail(request, reply));
server.put<UpdateRoute>('/livro/:id', protegida, (request, reply) => bookController.update(request, reply));
server.delete<DestroyRoute>('/livro/:id', protegida, (request, reply) => bookController.destroy(request, reply));

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
